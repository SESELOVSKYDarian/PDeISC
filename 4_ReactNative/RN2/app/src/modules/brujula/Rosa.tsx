import { StyleSheet, Text, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTema } from "@/theme/ThemeProvider";
import { tipo } from "@/theme/medidas";

const LADO = 248;

// rosa de los vientos: gira al revés del rumbo, la marca roja queda fija arriba
export function Rosa({ angulo }: { angulo: SharedValue<number> }) {
  const { colores } = useTema();

  const giro = useAnimatedStyle(() => ({
    transform: [{ rotate: `${withTiming(-angulo.get(), { duration: 110 })}deg` }],
  }));

  return (
    <View style={estilos.centro}>
      <View style={[estilos.marca, { backgroundColor: colores.peligro }]} />
      <Animated.View style={[estilos.disco, { backgroundColor: colores.superficie }, giro]}>
        <Text style={[tipo.titulo, estilos.norte, { color: colores.peligro }]}>N</Text>
        <Text style={[tipo.titulo, estilos.sur, { color: colores.textoSecundario }]}>S</Text>
        <Text style={[tipo.titulo, estilos.este, { color: colores.textoSecundario }]}>E</Text>
        <Text style={[tipo.titulo, estilos.oeste, { color: colores.textoSecundario }]}>O</Text>
        <View style={[estilos.punto, { backgroundColor: colores.separador }]} />
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: "center", gap: 10 },
  marca: { width: 4, height: 22, borderRadius: 2 },
  disco: { width: LADO, height: LADO, borderRadius: LADO / 2, alignItems: "center", justifyContent: "center" },
  norte: { position: "absolute", top: 18 },
  sur: { position: "absolute", bottom: 18 },
  este: { position: "absolute", right: 22 },
  oeste: { position: "absolute", left: 22 },
  punto: { width: 10, height: 10, borderRadius: 5 },
});
