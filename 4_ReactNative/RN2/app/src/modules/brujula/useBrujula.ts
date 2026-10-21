import { Barometer, Magnetometer } from "expo-sensors";
import { useRef } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSensor } from "@/hooks/useSensor";
import { anguloContinuo, puntoCardinal, rumboDesdeCampo } from "@/utils/angulos";

export function useBrujula() {
  const angulo = useSharedValue(0);
  const previo = useRef(0);

  const magnetometro = useSensor(Magnetometer, {
    intervaloMs: 60,
    alMedir: (m) => {
      previo.current = anguloContinuo(previo.current, rumboDesdeCampo(m.x, m.y));
      angulo.set(previo.current);
    },
  });
  const barometro = useSensor(Barometer, { intervaloMs: 500 });

  const campo = magnetometro.medida;
  const rumbo = campo ? rumboDesdeCampo(campo.x, campo.y) : null;
  const intensidad = campo ? Math.sqrt(campo.x ** 2 + campo.y ** 2 + campo.z ** 2) : null;

  return {
    angulo,
    rumbo,
    cardinal: rumbo === null ? "–" : puntoCardinal(rumbo),
    intensidad,
    magnetometroDisponible: magnetometro.disponible,
    presion: barometro.medida?.pressure ?? null,
    altitudRelativa: barometro.medida?.relativeAltitude ?? null,
    barometroDisponible: barometro.disponible,
  };
}
