import { CameraView } from "expo-camera";
import { Flashlight, FlashlightOff, ScanLine } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Aviso } from "@/components/common/Aviso";
import { BotonCircular } from "@/components/common/BotonCircular";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { PermisoGate } from "@/components/common/PermisoGate";
import { useMensaje } from "@/hooks/useMensaje";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, radio } from "@/theme/medidas";
import { ResultadoCodigo } from "./ResultadoCodigo";
import { useEscaner } from "./useEscaner";

const TIPOS = ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "pdf417", "datamatrix"] as const;

export default function EscanerScreen() {
  const { colores } = useTema();
  const e = useEscaner();
  const { mensaje, mostrar } = useMensaje();

  if (!e.permiso) {
    return (
      <Pantalla>
        <ActivityIndicator color={colores.acento} />
      </Pantalla>
    );
  }

  if (!e.permiso.granted) {
    return (
      <Pantalla>
        <PermisoGate
          icono={ScanLine}
          color="#34C759"
          titulo="Lector de códigos"
          detalle="Necesitamos la cámara para leer códigos QR y de barras."
          puedePreguntar={e.permiso.canAskAgain}
          onPermitir={e.pedirPermiso}
        />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      {mensaje ? <Aviso clase={mensaje.clase} texto={mensaje.texto} /> : null}

      <View style={estilos.visor}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          enableTorch={e.linterna}
          barcodeScannerSettings={{ barcodeTypes: [...TIPOS] }}
          onBarcodeScanned={e.escaneando ? e.alEscanear : undefined}
        />
        <View style={estilos.marco} pointerEvents="none" />
      </View>

      {e.ultimo ? (
        <ResultadoCodigo codigo={e.ultimo} alOtro={e.escanearOtro} alAviso={mostrar} />
      ) : (
        <View style={estilos.centro}>
          <BotonCircular
            icono={e.linterna ? Flashlight : FlashlightOff}
            etiqueta="Linterna"
            activo={e.linterna}
            onPress={e.alternarLinterna}
          />
        </View>
      )}

      {e.historial.length > 1 ? (
        <Grupo titulo="Anteriores">
          {e.historial.slice(1).map((c, i) => (
            <Fila key={`${c.dato}-${i}`} etiqueta={c.tipo} valor={c.dato} />
          ))}
        </Grupo>
      ) : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  visor: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radio.l + 6,
    overflow: "hidden",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  marco: {
    width: "62%",
    height: "62%",
    borderRadius: radio.l,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
  },
  centro: { alignItems: "center", paddingVertical: espacio.s },
});
