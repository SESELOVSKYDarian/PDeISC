import { Image, StyleSheet, View } from "react-native";
import { ISOTIPO } from "../../theme/logo";

// isotipo grande sobre una baldosa blanca (cabecera del login)
export default function LogoTile({ tamano = 104 }: { tamano?: number }) {
  return (
    <View style={[estilos.baldosa, { width: tamano, height: tamano, borderRadius: tamano * 0.28 }]}>
      <Image source={ISOTIPO} style={{ width: tamano * 0.78, height: tamano * 0.78 }} resizeMode="contain" accessibilityLabel="Logo DePaso" />
    </View>
  );
}

const estilos = StyleSheet.create({
  baldosa: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1A1049",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
