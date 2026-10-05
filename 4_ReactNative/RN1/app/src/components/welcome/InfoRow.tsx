import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTema } from "../../theme/ThemeProvider";

interface Props {
  icono: ReactNode;
  etiqueta: string;
  valor: string;
}

export default function InfoRow({ icono, etiqueta, valor }: Props) {
  const { colores } = useTema();

  return (
    <View style={[estilos.fila, { backgroundColor: colores.superficieAlt }]}>
      {icono}
      <View style={estilos.textos}>
        <Text style={[estilos.etiqueta, { color: colores.textoSuave }]}>{etiqueta}</Text>
        <Text style={[estilos.valor, { color: colores.texto }]} numberOfLines={1}>{valor}</Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14 },
  textos: { flex: 1 },
  etiqueta: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6 },
  valor: { fontSize: 16, fontWeight: "600", marginTop: 2 },
});
