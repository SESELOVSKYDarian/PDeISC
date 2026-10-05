import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { useTema } from "../../theme/ThemeProvider";
import PressableScale from "./PressableScale";

interface Props {
  titulo: string;
  onPress: () => void;
  cargando?: boolean;
  deshabilitado?: boolean;
  variante?: "primario" | "borde";
  icono?: ReactNode;
}

export default function Button({ titulo, onPress, cargando, deshabilitado, variante = "primario", icono }: Props) {
  const { colores } = useTema();
  const primario = variante === "primario";
  const color = primario ? colores.acentoTexto : colores.texto;
  const inactivo = deshabilitado || cargando;

  return (
    <PressableScale
      onPress={onPress}
      disabled={inactivo}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactivo, busy: !!cargando }}
      style={[
        estilos.boton,
        primario
          ? { backgroundColor: colores.acento }
          : { backgroundColor: colores.superficie, borderColor: colores.bordeControl, borderWidth: 1 },
        inactivo && estilos.inactivo,
      ]}
    >
      {cargando ? <ActivityIndicator color={color} /> : icono}
      <Text style={[estilos.texto, { color }]}>{cargando ? "Un segundo..." : titulo}</Text>
    </PressableScale>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 54,
    borderRadius: 27,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  inactivo: { opacity: 0.6 },
  texto: { fontSize: 17, fontWeight: "700" },
});
