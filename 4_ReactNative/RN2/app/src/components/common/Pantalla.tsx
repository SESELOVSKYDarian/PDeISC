import { ReactNode, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTema } from "@/theme/ThemeProvider";
import { anchoMaximo, espacio } from "@/theme/medidas";
import { BotonSubir } from "./BotonSubir";

// a partir de cuantos px de scroll aparece el boton de subir
const UMBRAL_SUBIR = 280;

interface Props {
  children: ReactNode;
  conTopInset?: boolean;
}

// contenedor de cada pantalla: scroll, centrado, con mucho aire y boton de subir
export function Pantalla({ children, conTopInset = false }: Props) {
  const { colores } = useTema();
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollView>(null);
  const [mostrarSubir, setMostrarSubir] = useState(false);

  // solo cambia el estado cuando cruza el umbral, no en cada frame
  function alScrollear(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setMostrarSubir(e.nativeEvent.contentOffset.y > UMBRAL_SUBIR);
  }

  return (
    <View style={[estilos.raiz, { backgroundColor: colores.fondo }]}>
      <ScrollView
        ref={scroll}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        onScroll={alScrollear}
        scrollEventThrottle={32}
        contentContainerStyle={[
          estilos.contenido,
          { paddingTop: conTopInset ? insets.top + espacio.m : espacio.m, paddingBottom: insets.bottom + espacio.xxl },
        ]}
      >
        <View style={estilos.columna}>{children}</View>
      </ScrollView>
      <BotonSubir visible={mostrarSubir} onPress={() => scroll.current?.scrollTo({ y: 0, animated: true })} />
    </View>
  );
}

const estilos = StyleSheet.create({
  raiz: { flex: 1 },
  contenido: { paddingHorizontal: 20, alignItems: "center" },
  columna: { width: "100%", maxWidth: anchoMaximo, gap: espacio.l },
});
