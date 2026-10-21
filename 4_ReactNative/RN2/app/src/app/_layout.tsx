import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Presentacion } from "@/components/home/Presentacion";
import { herramientas } from "@/data/herramientas";
import { ThemeProvider, useTema } from "@/theme/ThemeProvider";

function Navegacion() {
  const { modo, colores } = useTema();
  const [intro, setIntro] = useState(true);
  const terminarIntro = useCallback(() => setIntro(false), []);

  return (
    <>
      <StatusBar style={modo === "oscuro" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colores.fondo },
          headerTintColor: colores.acento,
          headerTitleStyle: { color: colores.texto, fontWeight: "600" },
          headerBackButtonDisplayMode: "minimal",
          contentStyle: { backgroundColor: colores.fondo },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {herramientas.map((h) => (
          <Stack.Screen key={h.ruta} name={h.ruta} options={{ title: h.titulo }} />
        ))}
      </Stack>
      {intro ? <Presentacion onTerminar={terminarIntro} /> : null}
    </>
  );
}

export default function LayoutRaiz() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Navegacion />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
