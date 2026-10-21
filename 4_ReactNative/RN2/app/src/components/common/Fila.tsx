import { StyleSheet, Text, View } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";

interface Props {
  etiqueta: string;
  valor: string;
  color?: string;
}

// fila de dato: etiqueta a la izquierda, valor a la derecha
export function Fila({ etiqueta, valor, color }: Props) {
  const { colores } = useTema();

  return (
    <View style={estilos.fila}>
      <Text style={[tipo.cuerpo, { color: colores.texto }]}>{etiqueta}</Text>
      <Text
        selectable
        numberOfLines={2}
        style={[tipo.cuerpo, estilos.valor, { color: color ?? colores.textoSecundario }]}
      >
        {valor}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    minHeight: 56,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espacio.m,
  },
  valor: { flexShrink: 1, textAlign: "right", fontVariant: ["tabular-nums"] },
});
