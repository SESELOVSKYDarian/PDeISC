import { Camera, Image as IconoImagen } from "lucide-react-native";
import { Image, StyleSheet, View } from "react-native";
import { Aviso } from "@/components/common/Aviso";
import { Boton } from "@/components/common/Boton";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { radio, espacio } from "@/theme/medidas";
import { tamanoArchivo } from "@/utils/formato";
import { useGaleria } from "./useGaleria";

export default function GaleriaScreen() {
  const { imagen, error, elegir, sacar } = useGaleria();

  return (
    <Pantalla>
      {error ? <Aviso clase="error" texto={error} /> : null}

      {imagen ? (
        <>
          <Image source={{ uri: imagen.uri }} style={estilos.imagen} resizeMode="cover" />
          <Grupo titulo="Detalles">
            <Fila etiqueta="Nombre" valor={imagen.fileName ?? "–"} />
            <Fila etiqueta="Tamaño" valor={`${imagen.width} × ${imagen.height} px`} />
            <Fila etiqueta="Peso" valor={tamanoArchivo(imagen.fileSize)} />
            <Fila etiqueta="Tipo" valor={imagen.mimeType ?? "–"} />
          </Grupo>
        </>
      ) : (
        <Aviso texto="Elegí una foto de tu galería o sacá una nueva para ver sus datos." />
      )}

      <View style={estilos.botones}>
        <Boton texto="Elegir de la galería" icono={IconoImagen} onPress={elegir} />
        <Boton texto="Sacar una foto" icono={Camera} variante="suave" onPress={sacar} />
      </View>
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  imagen: { width: "100%", aspectRatio: 4 / 3, borderRadius: radio.l },
  botones: { gap: espacio.m },
});
