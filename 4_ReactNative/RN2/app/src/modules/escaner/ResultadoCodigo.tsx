import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Copy, ExternalLink, ScanLine } from "lucide-react-native";
import { Linking, StyleSheet, Text, View } from "react-native";
import { Boton } from "@/components/common/Boton";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";
import { CodigoLeido, esLink } from "./useEscaner";

interface Props {
  codigo: CodigoLeido;
  alOtro: () => void;
  alAviso: (clase: "exito" | "error", texto: string) => void;
}

export function ResultadoCodigo({ codigo, alOtro, alAviso }: Props) {
  const { colores } = useTema();

  async function copiar() {
    await Clipboard.setStringAsync(codigo.dato);
    Haptics.selectionAsync().catch(() => {});
    alAviso("exito", "Copiado al portapapeles");
  }

  function abrir() {
    Linking.openURL(codigo.dato).catch(() => alAviso("error", "No pude abrir el link"));
  }

  return (
    <View style={estilos.caja}>
      <Grupo titulo="Código leído">
        <Fila etiqueta="Tipo" valor={codigo.tipo} />
        <View style={estilos.dato}>
          <Text selectable style={[tipo.cuerpo, { color: colores.texto }]}>
            {codigo.dato}
          </Text>
        </View>
      </Grupo>
      {esLink(codigo.dato) ? <Boton texto="Abrir link" icono={ExternalLink} onPress={abrir} /> : null}
      <Boton texto="Copiar" icono={Copy} variante="suave" onPress={copiar} />
      <Boton texto="Escanear otro" icono={ScanLine} variante="suave" onPress={alOtro} />
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { gap: espacio.m },
  dato: { padding: espacio.m },
});
