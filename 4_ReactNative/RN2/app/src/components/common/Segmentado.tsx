import { StyleSheet, Text, View } from "react-native";
import { useTema } from "@/theme/ThemeProvider";
import { radio, tipo } from "@/theme/medidas";
import { PressableScale } from "./PressableScale";

interface Props<T extends string> {
  opciones: { valor: T; texto: string }[];
  valor: T;
  onCambio: (valor: T) => void;
}

// control segmentado simple, estilo iOS
export function Segmentado<T extends string>({ opciones, valor, onCambio }: Props<T>) {
  const { colores } = useTema();

  return (
    <View style={[estilos.caja, { backgroundColor: colores.relleno }]}>
      {opciones.map((op) => {
        const activa = op.valor === valor;
        return (
          <PressableScale
            key={op.valor}
            onPress={() => onCambio(op.valor)}
            escala={0.98}
            etiqueta={op.texto}
            estiloExterno={estilos.opcionExterna}
            estilo={[estilos.opcion, activa && { backgroundColor: colores.superficie }]}
          >
            <Text style={[tipo.detalle, { fontWeight: "600", color: activa ? colores.texto : colores.textoSecundario }]}>
              {op.texto}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { flexDirection: "row", borderRadius: radio.m, padding: 3 },
  opcionExterna: { flex: 1 },
  opcion: { minHeight: 40, borderRadius: radio.m - 3, alignItems: "center", justifyContent: "center" },
});
