import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { useTema } from "@/theme/ThemeProvider";

// barra de carga: se achica/agranda con scaleX (sin tocar el layout)
export function BarraNivel({ nivel, color }: { nivel: number; color: string }) {
  const { colores } = useTema();

  return (
    <View style={[estilos.pista, { backgroundColor: colores.relleno }]}>
      <Animated.View
        style={[
          estilos.relleno,
          {
            backgroundColor: color,
            transform: [{ scaleX: Math.max(0.01, nivel) }],
            transitionProperty: "transform",
            transitionDuration: 400,
            transitionTimingFunction: "ease-out",
          },
        ]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pista: { height: 12, borderRadius: 6, overflow: "hidden" },
  relleno: { width: "100%", height: 12, transformOrigin: "left" },
});
