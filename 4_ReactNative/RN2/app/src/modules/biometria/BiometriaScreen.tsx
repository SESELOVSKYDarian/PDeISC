import { Fingerprint } from "lucide-react-native";
import { Platform, View } from "react-native";
import { Aviso } from "@/components/common/Aviso";
import { Boton } from "@/components/common/Boton";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { IconoHerramienta } from "@/components/common/IconoHerramienta";
import { Pantalla } from "@/components/common/Pantalla";
import { useTema } from "@/theme/ThemeProvider";
import { useBiometria } from "./useBiometria";

export default function BiometriaScreen() {
  const { colores } = useTema();
  const { estado, resultado, verificando, autenticar } = useBiometria();

  const lista = estado?.hardware && estado.registrada;

  return (
    <Pantalla>
      <View style={{ alignItems: "center", paddingTop: 16 }}>
        <IconoHerramienta icono={Fingerprint} color={resultado?.ok ? colores.exito : "#FF2D55"} tamano={88} />
      </View>

      {resultado?.ok ? <Aviso clase="exito" texto="Identidad verificada." /> : null}
      {resultado && !resultado.ok ? <Aviso clase="error" texto={resultado.motivo} /> : null}
      {estado && !estado.hardware ? <Aviso clase="error" texto="Este teléfono no tiene sensor biométrico." /> : null}
      {estado?.hardware && !estado.registrada ? (
        <Aviso clase="info" texto="Registrá una huella o rostro en los ajustes del teléfono para probar." />
      ) : null}
      {Platform.OS === "ios" && estado?.hardware ? (
        <Aviso clase="info" texto="Face ID no funciona dentro de Expo Go; sí en la app instalada." />
      ) : null}

      <Grupo titulo="Estado del teléfono">
        <Fila etiqueta="Sensor" valor={estado ? (estado.hardware ? "Disponible" : "No tiene") : "…"} />
        <Fila etiqueta="Registrada" valor={estado ? (estado.registrada ? "Sí" : "No") : "…"} />
        <Fila etiqueta="Tipo" valor={estado?.tipos.join(", ") || "–"} />
      </Grupo>

      <Boton texto="Verificar identidad" icono={Fingerprint} cargando={verificando} deshabilitado={!lista} onPress={autenticar} />
    </Pantalla>
  );
}
