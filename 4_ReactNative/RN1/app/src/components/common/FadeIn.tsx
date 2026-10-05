import { ReactNode, useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, Easing, Platform } from "react-native";

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

// entrada suave: fade + subida corta; delay sirve para escalonar
export default function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const progreso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let activo = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reducido) => {
      if (!activo) return;
      Animated.timing(progreso, {
        toValue: 1,
        duration: reducido ? 0 : 300,
        delay: reducido ? 0 : delay,
        easing: EASE_OUT,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    });
    return () => { activo = false; };
  }, [delay, progreso]);

  const subida = progreso.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  return <Animated.View style={{ opacity: progreso, transform: [{ translateY: subida }] }}>{children}</Animated.View>;
}
