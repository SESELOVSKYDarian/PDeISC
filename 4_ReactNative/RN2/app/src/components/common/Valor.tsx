import { StyleSheet, Text, View } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";

interface Props {
  numero: string;
  unidad?: string;
  etiqueta?: string;
}

// numero grande centrado, el protagonista de cada pantalla
export function Valor({ numero, unidad, etiqueta }: Props) {
  const { colores } = useTema();

  return (
    <View style={estilos.caja}>
      <View style={estilos.linea}>
        <Text style={[tipo.numero, estilos.numero, { color: colores.texto }]}>{numero}</Text>
        {unidad ? <Text style={[tipo.titulo, { color: colores.textoSecundario }]}>{unidad}</Text> : null}
      </View>
      {etiqueta ? <Text style={[tipo.detalle, { color: colores.textoSecundario }]}>{etiqueta}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { alignItems: "center", gap: espacio.xs, paddingVertical: espacio.l },
  linea: { flexDirection: "row", alignItems: "baseline", gap: espacio.s },
  numero: { fontVariant: ["tabular-nums"] },
});
