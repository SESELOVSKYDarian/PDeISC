import { ReactNode, useRef } from "react";
import { Animated, Easing, Platform, Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

interface Props extends Omit<PressableProps, "style" | "children"> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contenedor?: StyleProp<ViewStyle>; // layout del tocable (flex, ancho)
}

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

// cualquier cosa tocable que se achica un poquito al apretar
export default function PressableScale({ children, style, contenedor, disabled, ...resto }: Props) {
  const escala = useRef(new Animated.Value(1)).current;

  function animar(valor: number, ms: number) {
    Animated.timing(escala, { toValue: valor, duration: ms, easing: EASE_OUT, useNativeDriver: Platform.OS !== "web" }).start();
  }

  return (
    <Pressable
      {...resto}
      disabled={disabled}
      style={contenedor}
      onPressIn={() => animar(0.97, 120)}
      onPressOut={() => animar(1, 160)}
    >
      <Animated.View style={[style, { transform: [{ scale: escala }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
