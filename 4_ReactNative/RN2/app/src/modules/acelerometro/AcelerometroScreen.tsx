import { Pause, Play } from "lucide-react-native";
import { Aviso } from "@/components/common/Aviso";
import { Boton } from "@/components/common/Boton";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { Valor } from "@/components/common/Valor";
import { useTema } from "@/theme/ThemeProvider";
import { decimales } from "@/utils/formato";
import { BarraEje } from "./BarraEje";
import { useAcelerometro } from "./useAcelerometro";

export default function AcelerometroScreen() {
  const { colores } = useTema();
  const { medida, disponible, activo, alternar, ejes, fuerzaTotal, sacudidas, reiniciar } = useAcelerometro();

  if (disponible === false) {
    return (
      <Pantalla>
        <Aviso clase="error" texto="Este dispositivo no tiene acelerómetro." />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Valor numero={decimales(fuerzaTotal)} unidad="g" etiqueta="Fuerza total" />

      <Grupo titulo="Ejes" pie="Apoyado en una mesa, la fuerza total ronda 1 g (la gravedad).">
        <BarraEje eje="X" valor={ejes.x} texto={medida?.x ?? null} color={colores.peligro} />
        <BarraEje eje="Y" valor={ejes.y} texto={medida?.y ?? null} color={colores.exito} />
        <BarraEje eje="Z" valor={ejes.z} texto={medida?.z ?? null} color={colores.acento} />
      </Grupo>

      <Grupo pie="Sacudí el celular con fuerza para sumar.">
        <Fila etiqueta="Sacudidas" valor={String(sacudidas)} />
      </Grupo>

      <Boton
        texto={activo ? "Pausar" : "Reanudar"}
        icono={activo ? Pause : Play}
        variante="suave"
        onPress={alternar}
      />
      <Boton texto="Reiniciar contador" variante="suave" onPress={reiniciar} deshabilitado={sacudidas === 0} />
    </Pantalla>
  );
}
