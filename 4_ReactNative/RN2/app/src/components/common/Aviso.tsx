import { CircleAlert, CircleCheck, Info } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, radio, tipo } from "@/theme/medidas";

type Clase = "info" | "error" | "exito";

interface Props {
  clase?: Clase;
  texto: string;
}

// mensaje en linea (reemplaza a alert)
export function Aviso({ clase = "info", texto }: Props) {
  const { colores } = useTema();
  const color = clase === "error" ? colores.peligro : clase === "exito" ? colores.exito : colores.acento;
  const Icono = clase === "error" ? CircleAlert : clase === "exito" ? CircleCheck : Info;

  return (
    <View style={[estilos.caja, { backgroundColor: colores.superficie }]} accessibilityRole="alert">
      <Icono size={22} color={color} />
      <Text style={[tipo.detalle, estilos.texto, { color: colores.texto }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: {
    borderRadius: radio.l,
    padding: espacio.m,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacio.m,
  },
  texto: { flex: 1, lineHeight: 22 },
});
