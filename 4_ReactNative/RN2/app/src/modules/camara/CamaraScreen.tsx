import { CameraView } from "expo-camera";
import { Camera, Flashlight, FlashlightOff, SwitchCamera, Zap, ZapOff } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Aviso } from "@/components/common/Aviso";
import { BotonCircular } from "@/components/common/BotonCircular";
import { Pantalla } from "@/components/common/Pantalla";
import { PermisoGate } from "@/components/common/PermisoGate";
import { PressableScale } from "@/components/common/PressableScale";
import { Segmentado } from "@/components/common/Segmentado";
import { useMensaje } from "@/hooks/useMensaje";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, radio, tipo } from "@/theme/medidas";
import { Obturador } from "./Obturador";
import { UltimaCaptura } from "./UltimaCaptura";
import { useCamara } from "./useCamara";

const TEXTO_FLASH = { off: "Flash no", on: "Flash sí", auto: "Flash auto", screen: "Flash pantalla" };

export default function CamaraScreen() {
  const { colores } = useTema();
  const c = useCamara();
  const { mensaje, mostrar } = useMensaje();

  if (!c.permisoCamara) {
    return (
      <Pantalla>
        <ActivityIndicator color={colores.acento} />
      </Pantalla>
    );
  }

  if (!c.permisoCamara.granted) {
    return (
      <Pantalla>
        <PermisoGate
          icono={Camera}
          color="#8E8E93"
          titulo="Cámara"
          detalle="Necesitamos acceso a la cámara para sacar fotos y grabar video."
          puedePreguntar={c.permisoCamara.canAskAgain}
          onPermitir={c.pedirCamara}
        />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      {c.error ? <Aviso clase="error" texto={c.error} /> : null}
      {mensaje ? <Aviso clase={mensaje.clase} texto={mensaje.texto} /> : null}

      <View style={estilos.visor}>
        <CameraView
          ref={c.camara}
          style={StyleSheet.absoluteFill}
          facing={c.lado}
          mode={c.modo}
          flash={c.flash}
          enableTorch={c.linterna}
        />
        {c.modo === "picture" ? (
          <View style={estilos.flash}>
            <PressableScale onPress={c.ciclarFlash} etiqueta="Cambiar flash" estilo={estilos.pildora}>
              {c.flash === "off" ? <ZapOff size={16} color="#FFFFFF" /> : <Zap size={16} color="#FFFFFF" />}
              <Text style={[tipo.detalle, estilos.textoPildora]}>{TEXTO_FLASH[c.flash]}</Text>
            </PressableScale>
          </View>
        ) : null}
        {c.grabando ? (
          <View style={[estilos.pildora, estilos.rec, { backgroundColor: colores.peligro }]}>
            <Text style={[tipo.detalle, estilos.textoPildora]}>● Grabando</Text>
          </View>
        ) : null}
      </View>

      <Segmentado
        opciones={[
          { valor: "picture", texto: "Foto" },
          { valor: "video", texto: "Video" },
        ]}
        valor={c.modo}
        onCambio={c.cambiarModo}
      />

      <View style={estilos.controles}>
        <BotonCircular
          icono={c.linterna ? Flashlight : FlashlightOff}
          etiqueta="Linterna"
          activo={c.linterna}
          onPress={c.alternarLinterna}
        />
        <Obturador modo={c.modo} grabando={c.grabando} onPress={c.disparar} />
        <BotonCircular icono={SwitchCamera} etiqueta="Voltear cámara" onPress={c.voltear} deshabilitado={c.grabando} />
      </View>

      {c.captura ? <UltimaCaptura captura={c.captura} alError={(t) => mostrar("error", t)} /> : null}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  visor: { width: "100%", aspectRatio: 3 / 4, borderRadius: radio.l + 6, overflow: "hidden", backgroundColor: "#000" },
  flash: { position: "absolute", top: espacio.m, left: espacio.m },
  rec: { position: "absolute", top: espacio.m, right: espacio.m },
  pildora: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  textoPildora: { color: "#FFFFFF", fontWeight: "600" },
  controles: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingVertical: espacio.s },
});
