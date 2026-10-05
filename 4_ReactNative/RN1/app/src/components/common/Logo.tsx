import { Image, StyleSheet, Text, View } from "react-native";
import { ISOTIPO } from "../../theme/logo";

interface Props {
  texto: string;
  tamano?: number;
}

// isotipo + nombre (barras superiores)
export default function Logo({ texto, tamano = 40 }: Props) {
  return (
    <View style={estilos.fila} accessibilityRole="header">
      <Image source={ISOTIPO} style={{ width: tamano, height: tamano }} resizeMode="contain" accessibilityLabel="Logo DePaso" />
      <Text style={[estilos.nombre, { color: texto }]}>DePaso</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: "row", alignItems: "center", gap: 8 },
  nombre: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
});
