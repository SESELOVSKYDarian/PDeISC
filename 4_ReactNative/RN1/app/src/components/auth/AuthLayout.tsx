import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../../theme/ThemeProvider";
import FadeIn from "../common/FadeIn";
import LogoTile from "../common/LogoTile";
import ThemeToggle from "../common/ThemeToggle";

interface Props {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
}

// desde 800px (tablet apaisada, notebook, desktop) se parte en dos columnas
const ANCHO_ESCRITORIO = 800;

// marco común de Login y Registro
export default function AuthLayout({ titulo, subtitulo, children }: Props) {
  const { colores } = useTema();
  const { width } = useWindowDimensions();
  const ancho = width >= ANCHO_ESCRITORIO;

  return (
    <SafeAreaView style={[estilos.pantalla, { backgroundColor: colores.fondo }]}>
      <View style={[estilos.contenedor, ancho && estilos.fila]}>
        {ancho ? (
          <View style={[estilos.marca, { backgroundColor: colores.panelMarca }]}>
            <LogoTile tamano={120} />
            <View style={estilos.lema}>
              <Text style={[estilos.lemaTitulo, { color: colores.panelMarcaTexto }]}>
                Ahorrá en el camino, en serio.
              </Text>
              <Text style={[estilos.lemaTexto, { color: colores.panelMarcaTexto }]}>
                Ingresá con tu cuenta o seguí con Google, Meta o Discord.
              </Text>
            </View>
          </View>
        ) : null}

        <KeyboardAvoidingView style={estilos.lado} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
            <View style={estilos.barra}>
              <ThemeToggle />
            </View>
            <View style={estilos.centro}>
              <View style={estilos.tarjeta}>
                <FadeIn>
                  <View style={estilos.cabecera}>
                    {ancho ? null : <LogoTile />}
                    <Text style={[estilos.titulo, { color: colores.texto }]}>{titulo}</Text>
                    <Text style={[estilos.subtitulo, { color: colores.textoSuave }]}>{subtitulo}</Text>
                  </View>
                </FadeIn>
                <FadeIn delay={60}>{children}</FadeIn>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1 },
  contenedor: { flex: 1 },
  fila: { flexDirection: "row" },
  marca: { flex: 1, padding: 56, justifyContent: "space-between" },
  lema: { gap: 14, maxWidth: 460 },
  lemaTitulo: { fontSize: 46, fontWeight: "800", letterSpacing: -1.2, lineHeight: 52 },
  lemaTexto: { fontSize: 18, opacity: 0.8, lineHeight: 26 },
  lado: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20 },
  barra: { flexDirection: "row", justifyContent: "flex-end" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  tarjeta: { width: "100%", maxWidth: 440, gap: 28 },
  cabecera: { alignItems: "center", gap: 10 },
  titulo: { fontSize: 34, fontWeight: "800", letterSpacing: -0.8, marginTop: 14, textAlign: "center" },
  subtitulo: { fontSize: 18, textAlign: "center" },
});
