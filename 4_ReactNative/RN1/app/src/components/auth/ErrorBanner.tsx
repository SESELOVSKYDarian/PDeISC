import CircleAlert from "lucide-react-native/icons/circle-alert";
import { StyleSheet, Text, View } from "react-native";
import { useTema } from "../../theme/ThemeProvider";
import { ICONO } from "../../theme/iconos";

// aviso de error de un formulario (credenciales, servidor caído, etc.)
export default function ErrorBanner({ mensaje }: { mensaje: string }) {
  const { colores } = useTema();
  if (!mensaje) return null;

  return (
    <View accessibilityRole="alert" style={[estilos.aviso, { backgroundColor: colores.errorFondo }]}>
      <CircleAlert size={ICONO.sm} color={colores.error} />
      <Text style={[estilos.texto, { color: colores.error }]}>{mensaje}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12 },
  texto: { flex: 1, fontSize: 14, fontWeight: "500" },
});
