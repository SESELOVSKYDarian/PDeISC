import { BarcodeScanningResult, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";

export interface CodigoLeido {
  tipo: string;
  dato: string;
}

const MAX_HISTORIAL = 5;

export function esLink(dato: string): boolean {
  return /^https?:\/\/\S+$/i.test(dato);
}

export function useEscaner() {
  const [permiso, pedirPermiso] = useCameraPermissions();
  const [escaneando, setEscaneando] = useState(true);
  const [linterna, setLinterna] = useState(false);
  const [ultimo, setUltimo] = useState<CodigoLeido | null>(null);
  const [historial, setHistorial] = useState<CodigoLeido[]>([]);

  // el primer codigo leido frena el escaneo hasta que pidan otro
  const alEscanear = useCallback((r: BarcodeScanningResult) => {
    const codigo = { tipo: r.type.toUpperCase(), dato: r.data };
    setEscaneando(false);
    setUltimo(codigo);
    setHistorial((h) => [codigo, ...h].slice(0, MAX_HISTORIAL));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }, []);

  const escanearOtro = useCallback(() => {
    setUltimo(null);
    setEscaneando(true);
  }, []);

  return {
    permiso,
    pedirPermiso,
    escaneando,
    linterna,
    ultimo,
    historial,
    alEscanear,
    escanearOtro,
    alternarLinterna: () => setLinterna((l) => !l),
  };
}
