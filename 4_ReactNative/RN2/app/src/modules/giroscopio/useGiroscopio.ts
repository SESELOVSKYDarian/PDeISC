import { Gyroscope } from "expo-sensors";
import { useSharedValue } from "react-native-reanimated";
import { useSensor } from "@/hooks/useSensor";
import { entre } from "@/utils/formato";

const GANANCIA = 5;
const RETORNO = 0.96;

// el giroscopio mide velocidad de giro; la pelota se va hacia donde girás y vuelve sola al centro
export function useGiroscopio(radioMaximo: number) {
  const px = useSharedValue(0);
  const py = useSharedValue(0);

  const sensor = useSensor(Gyroscope, {
    intervaloMs: 33,
    alMedir: (m) => {
      px.set(entre(px.get() * RETORNO + m.y * GANANCIA, -radioMaximo, radioMaximo));
      py.set(entre(py.get() * RETORNO + m.x * GANANCIA, -radioMaximo, radioMaximo));
    },
  });

  const medida = sensor.medida;
  const radianes = medida ? Math.sqrt(medida.x ** 2 + medida.y ** 2 + medida.z ** 2) : null;
  const gradosPorSegundo = radianes === null ? null : (radianes * 180) / Math.PI;

  return { ...sensor, pelota: { x: px, y: py }, gradosPorSegundo };
}
