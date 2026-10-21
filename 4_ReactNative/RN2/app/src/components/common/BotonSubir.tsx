import { ArrowUp } from "lucide-react-native";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTema } from "@/theme/ThemeProvider";
import { espacio } from "@/theme/medidas";
import { PressableScale } from "./PressableScale";

interface Props {
  visible: boolean;
  onPress: () => void;
}

// boton flotante para volver arriba: aparece al bajar y se esconde cerca del inicio
export function BotonSubir({ visible, onPress }: Props) {
  const { colores } = useTema();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        estilos.caja,
        {
          bottom: insets.bottom + espacio.l,
          opacity: visible ? 1 : 0,
          transform: [{ scale: visible ? 1 : 0.9 }, { translateY: visible ? 0 : 8 }],
          transitionProperty: ["opacity", "transform"],
          transitionDuration: 200,
          transitionTimingFunction: "ease-out",
        },
      ]}
    >
      <PressableScale
        onPress={onPress}
        disabled={!visible}
        etiqueta="Volver arriba"
        estilo={[estilos.boton, { backgroundColor: colores.acento }]}
      >
        <ArrowUp size={24} color="#FFFFFF" strokeWidth={2.4} />
      </PressableScale>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  caja: { position: "absolute", right: espacio.l },
  boton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
