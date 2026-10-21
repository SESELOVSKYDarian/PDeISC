import { LucideIcon } from "lucide-react-native";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";
import { Boton } from "./Boton";
import { IconoHerramienta } from "./IconoHerramienta";

interface Props {
  icono: LucideIcon;
  color: string;
  titulo: string;
  detalle: string;
  puedePreguntar: boolean;
  onPermitir: () => void;
}

// pantalla de permiso: pide acceso o manda a ajustes si ya lo negaron
export function PermisoGate({ icono, color, titulo, detalle, puedePreguntar, onPermitir }: Props) {
  const { colores } = useTema();

  return (
    <View style={estilos.caja}>
      <View style={estilos.icono}>
        <IconoHerramienta icono={icono} color={color} tamano={72} />
      </View>
      <View style={estilos.textos}>
        <Text style={[tipo.titulo, estilos.centro, { color: colores.texto }]}>{titulo}</Text>
        <Text style={[tipo.cuerpo, estilos.centro, { color: colores.textoSecundario }]}>{detalle}</Text>
      </View>
      {puedePreguntar ? (
        <Boton texto="Permitir acceso" onPress={onPermitir} />
      ) : (
        <Boton texto="Abrir ajustes" variante="suave" onPress={() => Linking.openSettings()} />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { gap: espacio.xl, paddingTop: espacio.xxl },
  icono: { alignItems: "center" },
  textos: { gap: espacio.s, alignItems: "center", paddingHorizontal: espacio.m },
  centro: { textAlign: "center" },
});
