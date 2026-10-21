import { useCallback, useEffect, useRef, useState } from "react";

// forma minima que comparten Accelerometer, Gyroscope, Magnetometer y Barometer
interface SensorExpo<T> {
  isAvailableAsync(): Promise<boolean>;
  setUpdateInterval(ms: number): void;
  addListener(oyente: (medida: T) => void): { remove: () => void };
}

interface Opciones<T> {
  intervaloMs?: number;
  // se llama en cada medicion (rapido, sin re-render)
  alMedir?: (medida: T) => void;
}

const REFRESCO_PANTALLA_MS = 120;

export function useSensor<T>(sensor: SensorExpo<T>, { intervaloMs = 50, alMedir }: Opciones<T> = {}) {
  const [medida, setMedida] = useState<T | null>(null);
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [activo, setActivo] = useState(true);
  const alMedirRef = useRef(alMedir);
  alMedirRef.current = alMedir;

  // averiguo si el sensor existe en este telefono
  useEffect(() => {
    sensor
      .isAvailableAsync()
      .then(setDisponible)
      .catch(() => setDisponible(false));
  }, [sensor]);

  // escucho mientras este activo y disponible
  useEffect(() => {
    if (!disponible || !activo) return;
    let ultimo = 0;
    try {
      sensor.setUpdateInterval(intervaloMs);
      const suscripcion = sensor.addListener((m) => {
        alMedirRef.current?.(m);
        const ahora = Date.now();
        if (ahora - ultimo >= REFRESCO_PANTALLA_MS) {
          ultimo = ahora;
          setMedida(m);
        }
      });
      return () => suscripcion.remove();
    } catch {
      // el sensor dijo estar disponible pero no deja suscribirse (pasa en web)
      setDisponible(false);
    }
  }, [sensor, disponible, activo, intervaloMs]);

  const alternar = useCallback(() => setActivo((a) => !a), []);

  return { medida, disponible, activo, alternar };
}
