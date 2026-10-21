import { LucideIcon } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, radio, tipo } from "@/theme/medidas";
import { PressableScale } from "./PressableScale";

type Variante = "primario" | "suave" | "peligro";

interface Props {
  texto: string;
  onPress: () => void;
  variante?: Variante;
  icono?: LucideIcon;
  cargando?: boolean;
  deshabilitado?: boolean;
}

export function Boton({ texto, onPress, variante = "primario", icono: Icono, cargando, deshabilitado }: Props) {
  const { colores } = useTema();
  const fondo = variante === "primario" ? colores.acento : variante === "peligro" ? colores.peligro : colores.relleno;
  const letra = variante === "suave" ? colores.acento : "#FFFFFF";

  return (
    <PressableScale
      onPress={onPress}
      disabled={deshabilitado || cargando}
      etiqueta={texto}
      estilo={[estilos.boton, { backgroundColor: fondo }]}
    >
      {cargando ? (
        <ActivityIndicator color={letra} />
      ) : (
        <>
          {Icono ? <Icono size={20} color={letra} strokeWidth={2.2} /> : null}
          <Text style={[tipo.cuerpo, estilos.texto, { color: letra }]}>{texto}</Text>
        </>
      )}
    </PressableScale>
  );
}

const estilos = StyleSheet.create({
  boton: {
    minHeight: 54,
    borderRadius: radio.m,
    paddingHorizontal: espacio.l,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espacio.s,
  },
  texto: { fontWeight: "600" },
});
