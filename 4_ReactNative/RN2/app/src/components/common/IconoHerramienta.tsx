import { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

interface Props {
  icono: LucideIcon;
  color: string;
  tamano?: number;
}

// icono blanco sobre cuadrado de color, estilo ajustes de iOS
export function IconoHerramienta({ icono: Icono, color, tamano = 36 }: Props) {
  return (
    <View style={[estilos.caja, { backgroundColor: color, width: tamano, height: tamano, borderRadius: tamano * 0.28 }]}>
      <Icono size={tamano * 0.58} color="#FFFFFF" strokeWidth={2.2} />
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { alignItems: "center", justifyContent: "center" },
});
