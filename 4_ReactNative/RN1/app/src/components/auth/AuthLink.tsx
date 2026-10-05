import { Pressable, StyleSheet, Text } from "react-native";
import { useTema } from "../../theme/ThemeProvider";

interface Props {
  pregunta: string;
  accion: string;
  onPress: () => void;
}

// "¿No tenés cuenta? Registrate" / "¿Ya tenés cuenta? Iniciá sesión"
export default function AuthLink({ pregunta, accion, onPress }: Props) {
  const { colores } = useTema();

  return (
    <Pressable onPress={onPress} accessibilityRole="link" hitSlop={8} style={estilos.fila}>
      <Text style={[estilos.texto, { color: colores.textoSuave }]}>
        {pregunta} <Text style={[estilos.accion, { color: colores.texto }]}>{accion}</Text>
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: { alignItems: "center", justifyContent: "center", minHeight: 44 },
  texto: { fontSize: 16, textAlign: "center" },
  accion: { fontWeight: "700", textDecorationLine: "underline" },
});
