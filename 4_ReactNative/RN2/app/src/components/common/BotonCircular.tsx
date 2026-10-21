import { LucideIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { PressableScale } from "./PressableScale";

interface Props {
  icono: LucideIcon;
  etiqueta: string;
  onPress: () => void;
  activo?: boolean;
  deshabilitado?: boolean;
}

// boton redondo con icono (linterna, voltear, etc.)
export function BotonCircular({ icono: Icono, etiqueta, onPress, activo, deshabilitado }: Props) {
  const { colores } = useTema();

  return (
    <PressableScale
      onPress={onPress}
      disabled={deshabilitado}
      etiqueta={etiqueta}
      estilo={[estilos.boton, { backgroundColor: activo ? colores.acento : colores.relleno }]}
    >
      <Icono size={24} color={activo ? "#FFFFFF" : colores.texto} strokeWidth={2} />
    </PressableScale>
  );
}

const estilos = StyleSheet.create({
  boton: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
});
