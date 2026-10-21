import { Clipboard as IconoPegar, Copy, Share2 } from "lucide-react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Aviso } from "@/components/common/Aviso";
import { Boton } from "@/components/common/Boton";
import { Pantalla } from "@/components/common/Pantalla";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, radio, tipo } from "@/theme/medidas";
import { usePortapapeles } from "./usePortapapeles";

export default function PortapapelesScreen() {
  const { colores } = useTema();
  const p = usePortapapeles();

  return (
    <Pantalla>
      {p.mensaje ? <Aviso clase={p.mensaje.clase} texto={p.mensaje.texto} /> : null}

      <View style={estilos.campo}>
        <Text style={[tipo.seccion, { color: colores.textoSecundario }]}>TEXTO</Text>
        <TextInput
          value={p.texto}
          onChangeText={p.setTexto}
          placeholder="Escribí o pegá algo acá"
          placeholderTextColor={colores.textoSecundario}
          multiline
          style={[estilos.entrada, tipo.cuerpo, { backgroundColor: colores.superficie, color: colores.texto }]}
        />
      </View>

      <View style={{ gap: espacio.m }}>
        <Boton texto="Copiar" icono={Copy} onPress={p.copiar} />
        <Boton texto="Pegar" icono={IconoPegar} variante="suave" onPress={p.pegar} />
        <Boton texto="Compartir" icono={Share2} variante="suave" onPress={p.compartir} />
        <Boton texto="Limpiar" variante="suave" onPress={p.limpiar} deshabilitado={p.texto.length === 0} />
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  campo: { gap: espacio.s },
  entrada: { minHeight: 140, borderRadius: radio.l, padding: espacio.m, textAlignVertical: "top" },
});
