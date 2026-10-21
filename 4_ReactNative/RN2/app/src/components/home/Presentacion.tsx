import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { Easing, FadeIn, FadeInDown, FadeOut } from "react-native-reanimated";
import { Logo } from "@/components/common/Logo";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";

const DURACION_MS = 1700;
const SALIDA_SUAVE = Easing.bezier(0.23, 1, 0.32, 1);

// pantalla de arranque: logo y nombre, y se va sola
export function Presentacion({ onTerminar }: { onTerminar: () => void }) {
  const { colores } = useTema();

  useEffect(() => {
    const timer = setTimeout(onTerminar, DURACION_MS);
    return () => clearTimeout(timer);
  }, [onTerminar]);

  return (
    <Animated.View
      exiting={FadeOut.duration(280)}
      style={[estilos.fondo, { backgroundColor: colores.fondo }]}
      pointerEvents="none"
    >
      <Animated.View entering={FadeIn.duration(450).easing(SALIDA_SUAVE)}>
        <Logo tamano={132} color={colores.acento} />
      </Animated.View>
      <Animated.View entering={FadeInDown.delay(180).duration(420).easing(SALIDA_SUAVE)} style={estilos.textos}>
        <Text style={[tipo.tituloGrande, { color: colores.texto }]}>SensorLab</Text>
        <Text style={[tipo.cuerpo, { color: colores.textoSecundario }]}>Las herramientas de tu celular</Text>
      </Animated.View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  fondo: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center", gap: espacio.l, zIndex: 10 },
  textos: { alignItems: "center", gap: espacio.xs },
});
