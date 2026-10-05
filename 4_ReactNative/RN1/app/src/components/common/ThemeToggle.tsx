import Moon from "lucide-react-native/icons/moon";
import Sun from "lucide-react-native/icons/sun";
import { StyleSheet } from "react-native";
import { useTema } from "../../theme/ThemeProvider";
import { ICONO } from "../../theme/iconos";
import PressableScale from "./PressableScale";

export default function ThemeToggle() {
  const { modo, colores, alternar } = useTema();
  const Icono = modo === "claro" ? Moon : Sun;

  return (
    <PressableScale
      onPress={alternar}
      accessibilityRole="button"
      accessibilityLabel={modo === "claro" ? "Activar tema oscuro" : "Activar tema claro"}
      style={[estilos.boton, { backgroundColor: colores.superficie, borderColor: colores.bordeControl }]}
    >
      <Icono size={ICONO.md} color={colores.texto} />
    </PressableScale>
  );
}

const estilos = StyleSheet.create({
  boton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
