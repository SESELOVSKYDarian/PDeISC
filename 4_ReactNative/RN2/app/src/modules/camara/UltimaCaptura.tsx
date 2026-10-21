import * as Sharing from "expo-sharing";
import { Share2, Video } from "lucide-react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import { Boton } from "@/components/common/Boton";
import { Grupo } from "@/components/common/Grupo";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, radio, tipo } from "@/theme/medidas";
import { Captura } from "./useCamara";

// ultima foto o video: vista previa y boton para compartir
export function UltimaCaptura({ captura, alError }: { captura: Captura; alError: (texto: string) => void }) {
  const { colores } = useTema();

  async function compartir() {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        alError("Compartir no está disponible en este dispositivo.");
        return;
      }
      await Sharing.shareAsync(captura.uri);
    } catch {
      alError("No se pudo compartir el archivo.");
    }
  }

  return (
    <Grupo titulo={captura.tipo === "picture" ? "Última foto" : "Último video"}>
      <View style={estilos.contenido}>
        {captura.tipo === "picture" ? (
          <Image source={{ uri: captura.uri }} style={estilos.imagen} resizeMode="cover" />
        ) : (
          <View style={estilos.video}>
            <Video size={22} color={colores.acento} />
            <Text style={[tipo.cuerpo, { color: colores.texto }]}>Video guardado</Text>
          </View>
        )}
        <Boton texto="Compartir" icono={Share2} variante="suave" onPress={compartir} />
      </View>
    </Grupo>
  );
}

const estilos = StyleSheet.create({
  contenido: { padding: espacio.m, gap: espacio.m },
  imagen: { width: "100%", aspectRatio: 4 / 3, borderRadius: radio.m },
  video: { flexDirection: "row", alignItems: "center", gap: espacio.m, paddingVertical: espacio.s },
});
