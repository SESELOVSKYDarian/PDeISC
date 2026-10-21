import * as Haptics from "expo-haptics";
import { Accelerometer } from "expo-sensors";
import { useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { useSensor } from "@/hooks/useSensor";

const UMBRAL_SACUDIDA_G = 2.3;
const ESPERA_ENTRE_SACUDIDAS_MS = 700;

export function useAcelerometro() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const z = useSharedValue(0);
  const [sacudidas, setSacudidas] = useState(0);
  const ultimaSacudida = useRef(0);

  const sensor = useSensor(Accelerometer, {
    intervaloMs: 50,
    alMedir: (m) => {
      x.set(m.x);
      y.set(m.y);
      z.set(m.z);

      // detecto sacudida por fuerza total
      const fuerza = Math.sqrt(m.x ** 2 + m.y ** 2 + m.z ** 2);
      const ahora = Date.now();
      if (fuerza > UMBRAL_SACUDIDA_G && ahora - ultimaSacudida.current > ESPERA_ENTRE_SACUDIDAS_MS) {
        ultimaSacudida.current = ahora;
        setSacudidas((n) => n + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
    },
  });

  const medida = sensor.medida;
  const fuerzaTotal = medida ? Math.sqrt(medida.x ** 2 + medida.y ** 2 + medida.z ** 2) : null;

  return { ...sensor, ejes: { x, y, z }, fuerzaTotal, sacudidas, reiniciar: () => setSacudidas(0) };
}
