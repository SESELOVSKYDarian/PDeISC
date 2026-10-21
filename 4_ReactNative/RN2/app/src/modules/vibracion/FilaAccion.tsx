import { Pressable, StyleSheet, Text } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";

interface Props {
  texto: string;
  onPress: () => void;
}

// fila tocable: se resalta al apretar y dispara la accion
export function FilaAccion({ texto, onPress }: Props) {
  const { colores } = useTema();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [estilos.fila, pressed && { backgroundColor: colores.relleno }]}
    >
      <Text style={[tipo.cuerpo, { color: colores.acento }]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: { minHeight: 56, paddingHorizontal: espacio.m, justifyContent: "center" },
});
