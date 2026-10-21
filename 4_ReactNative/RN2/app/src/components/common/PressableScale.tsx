import { ReactNode, useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

interface Props {
  onPress?: () => void;
  disabled?: boolean;
  escala?: number;
  estilo?: StyleProp<ViewStyle>;
  estiloExterno?: StyleProp<ViewStyle>;
  etiqueta?: string;
  children: ReactNode;
}

// feedback al apretar: se achica al instante y vuelve suave
export function PressableScale({ onPress, disabled, escala = 0.97, estilo, estiloExterno, etiqueta, children }: Props) {
  const [apretado, setApretado] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setApretado(true)}
      onPressOut={() => setApretado(false)}
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      accessibilityState={{ disabled }}
      style={estiloExterno}
    >
      <Animated.View
        style={[
          estilo,
          {
            opacity: disabled ? 0.4 : 1,
            transform: [{ scale: apretado ? escala : 1 }],
            transitionProperty: "transform",
            transitionDuration: apretado ? 90 : 160,
            transitionTimingFunction: "ease-out",
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
