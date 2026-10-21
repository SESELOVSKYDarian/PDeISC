import { Aviso } from "@/components/common/Aviso";
import { Fila } from "@/components/common/Fila";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { Valor } from "@/components/common/Valor";
import { decimales } from "@/utils/formato";
import { Rosa } from "./Rosa";
import { useBrujula } from "./useBrujula";

export default function BrujulaScreen() {
  const b = useBrujula();

  if (b.magnetometroDisponible === false) {
    return (
      <Pantalla>
        <Aviso clase="error" texto="Este dispositivo no tiene magnetómetro." />
      </Pantalla>
    );
  }

  return (
    <Pantalla>
      <Valor numero={decimales(b.rumbo, 0)} unidad={`° ${b.cardinal}`} etiqueta="Rumbo" />

      <Rosa angulo={b.angulo} />

      <Grupo titulo="Magnetómetro" pie="Para que apunte bien, apoyá el celular plano y alejalo de imanes.">
        <Fila etiqueta="Campo magnético" valor={`${decimales(b.intensidad, 1)} µT`} />
      </Grupo>

      <Grupo titulo="Barómetro">
        {b.barometroDisponible === false ? (
          <Fila etiqueta="Presión" valor="No disponible" />
        ) : (
          <Fila etiqueta="Presión" valor={`${decimales(b.presion, 1)} hPa`} />
        )}
        {b.altitudRelativa !== null ? (
          <Fila etiqueta="Altura relativa" valor={`${decimales(b.altitudRelativa)} m`} />
        ) : (
          <Fila etiqueta="Altura relativa" valor="Solo en iPhone" />
        )}
      </Grupo>
    </Pantalla>
  );
}
