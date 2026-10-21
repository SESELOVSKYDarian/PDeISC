import { Pause, Play } from "lucide-react-native";
import { Aviso } from "@/components/common/Aviso";
import { Boton } from "@/components/common/Boton";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { Valor } from "@/components/common/Valor";
import { decimales } from "@/utils/formato";
import { Pelota, RADIO_MAXIMO } from "./Pelota";
import { useGiroscopio } from "./useGiroscopio";

export default function GiroscopioScreen() {
  const { medida, disponible, activo, alternar, pelota, gradosPorSegundo } = useGiroscopio(RADIO_MAXIMO);

  if (disponible === false) {
    return (
      <Pantalla>
        <Aviso clase="error" texto="Este dispositivo no tiene giroscopio." />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Valor numero={decimales(gradosPorSegundo, 0)} unidad="°/s" etiqueta="Velocidad de giro" />

      <Pelota x={pelota.x} y={pelota.y} />

      <Grupo titulo="Rotación por eje" pie="Girá el celular y la pelota se mueve. Al dejarlo quieto vuelve al centro.">
        <Fila etiqueta="X" valor={`${decimales(medida?.x)} rad/s`} />
        <Fila etiqueta="Y" valor={`${decimales(medida?.y)} rad/s`} />
        <Fila etiqueta="Z" valor={`${decimales(medida?.z)} rad/s`} />
      </Grupo>

      <Boton
        texto={activo ? "Pausar" : "Reanudar"}
        icono={activo ? Pause : Play}
        variante="suave"
        onPress={alternar}
      />
    </Pantalla>
  );
}
