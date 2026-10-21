import { StyleSheet, Text, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";
import { decimales } from "@/utils/formato";

interface Props {
  eje: string;
  // valor en g, entre -2 y 2
  valor: SharedValue<number>;
  texto: number | null;
  color: string;
}

// barra que crece desde el centro hacia el lado del valor
export function BarraEje({ eje, valor, texto, color }: Props) {
  const { colores } = useTema();

  const relleno = useAnimatedStyle(() => ({
    transform: [{ scaleX: withTiming(Math.max(-1, Math.min(1, valor.get() / 2)), { duration: 90 }) }],
  }));

  return (
    <View style={estilos.fila}>
      <Text style={[tipo.cuerpo, estilos.eje, { color: colores.textoSecundario }]}>{eje}</Text>
      <View style={[estilos.pista, { backgroundColor: colores.relleno }]}>
        <Animated.View style={[estilos.relleno, { backgroundColor: color }, relleno]} />
      </View>
      <Text style={[tipo.detalle, estilos.numero, { color: colores.texto }]}>{decimales(texto)}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: "row", alignItems: "center", gap: espacio.m, padding: espacio.m },
  eje: { width: 16, fontWeight: "600" },
  pista: { flex: 1, height: 10, borderRadius: 5, overflow: "hidden" },
  relleno: { position: "absolute", left: "50%", width: "50%", height: 10, transformOrigin: "left" },
  numero: { width: 56, textAlign: "right", fontVariant: ["tabular-nums"] },
});
