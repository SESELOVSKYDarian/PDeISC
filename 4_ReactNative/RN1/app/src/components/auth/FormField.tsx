import { ReactNode, useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { useTema } from "../../theme/ThemeProvider";

interface Props extends TextInputProps {
  etiqueta: string; // label flotante: hace de placeholder y sube al escribir
  error?: string;
  icono: ReactNode;
  derecha?: ReactNode;
}

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export default function FormField({ etiqueta, error, icono, derecha, ...input }: Props) {
  const { colores } = useTema();
  const [enfocado, setEnfocado] = useState(false);
  const flotando = enfocado || (typeof input.value === "string" && input.value.length > 0);
  const progreso = useRef(new Animated.Value(flotando ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progreso, {
      toValue: flotando ? 1 : 0,
      duration: 160,
      easing: EASE_OUT,
      useNativeDriver: Platform.OS !== "web",
    }).start();
  }, [flotando, progreso]);

  const borde = error ? colores.error : enfocado ? colores.acento : colores.bordeControl;
  const sube = progreso.interpolate({ inputRange: [0, 1], outputRange: [0, -11] });
  const escala = progreso.interpolate({ inputRange: [0, 1], outputRange: [1, 0.74] });

  return (
    <View style={estilos.grupo}>
      <View style={[estilos.caja, { backgroundColor: colores.superficie, borderColor: borde }]}>
        {icono}
        <View style={estilos.campo}>
          <Animated.Text
            pointerEvents="none"
            importantForAccessibility="no-hide-descendants"
            style={[estilos.etiqueta, { color: colores.textoSuave, transform: [{ translateY: sube }, { scale: escala }] }]}
          >
            {etiqueta}
          </Animated.Text>
          <TextInput
            {...input}
            accessibilityLabel={etiqueta}
            onFocus={(e) => { setEnfocado(true); input.onFocus?.(e); }}
            onBlur={(e) => { setEnfocado(false); input.onBlur?.(e); }}
            style={[estilos.input, { color: colores.texto }]}
          />
        </View>
        {derecha}
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={[estilos.error, { color: colores.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { gap: 6 },
  caja: {
    minHeight: 58,
    borderWidth: 1.5,
    borderRadius: 29,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  campo: { flex: 1, height: 56, justifyContent: "center" },
  etiqueta: { position: "absolute", left: 0, fontSize: 17, transformOrigin: "left center" },
  input: { height: 56, fontSize: 17, paddingTop: 20, paddingBottom: 2, outlineStyle: "none" } as object,
  error: { fontSize: 13, marginLeft: 20 },
});
