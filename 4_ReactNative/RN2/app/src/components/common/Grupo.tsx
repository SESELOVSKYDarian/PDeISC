import { Children, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, radio, tipo } from "@/theme/medidas";

interface Props {
  titulo?: string;
  pie?: string;
  children: ReactNode;
}

// bloque redondeado con filas separadas por una linea fina
export function Grupo({ titulo, pie, children }: Props) {
  const { colores } = useTema();
  const filas = Children.toArray(children);

  return (
    <View style={{ gap: espacio.s }}>
      {titulo ? (
        <Text style={[tipo.seccion, estilos.titulo, { color: colores.textoSecundario }]}>{titulo.toUpperCase()}</Text>
      ) : null}
      <View style={[estilos.caja, { backgroundColor: colores.superficie }]}>
        {filas.map((fila, i) => (
          <View key={i}>
            {i > 0 ? <View style={[estilos.linea, { backgroundColor: colores.separador }]} /> : null}
            {fila}
          </View>
        ))}
      </View>
      {pie ? <Text style={[tipo.seccion, estilos.pie, { color: colores.textoSecundario }]}>{pie}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  titulo: { paddingHorizontal: espacio.m },
  pie: { paddingHorizontal: espacio.m, lineHeight: 18 },
  caja: { borderRadius: radio.l, overflow: "hidden" },
  linea: { height: StyleSheet.hairlineWidth, marginLeft: espacio.m },
});
