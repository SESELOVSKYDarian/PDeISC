import { StyleSheet, View } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useTema } from "@/theme/ThemeProvider";
import { radio } from "@/theme/medidas";

export const LADO_AREA = 260;
export const LADO_PELOTA = 56;
export const RADIO_MAXIMO = (LADO_AREA - LADO_PELOTA) / 2;

interface Props {
  x: SharedValue<number>;
  y: SharedValue<number>;
}

// area cuadrada con una pelota que sigue el giro del telefono
export function Pelota({ x, y }: Props) {
  const { colores } = useTema();

  const estiloPelota = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(x.get(), { duration: 60 }) },
      { translateY: withTiming(y.get(), { duration: 60 }) },
    ],
  }));

  return (
    <View style={estilos.centro}>
      <View style={[estilos.area, { backgroundColor: colores.superficie }]}>
        <View style={[estilos.ejeH, { backgroundColor: colores.separador }]} />
        <View style={[estilos.ejeV, { backgroundColor: colores.separador }]} />
        <Animated.View style={[estilos.pelota, { backgroundColor: colores.acento }, estiloPelota]} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  centro: { alignItems: "center" },
  area: { width: LADO_AREA, height: LADO_AREA, borderRadius: radio.l + 10, alignItems: "center", justifyContent: "center" },
  ejeH: { position: "absolute", width: "100%", height: StyleSheet.hairlineWidth },
  ejeV: { position: "absolute", height: "100%", width: StyleSheet.hairlineWidth },
  pelota: { width: LADO_PELOTA, height: LADO_PELOTA, borderRadius: LADO_PELOTA / 2 },
});
