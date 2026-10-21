import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";

export type Modo = "picture" | "video";
export interface Captura {
  uri: string;
  tipo: Modo;
}

const SIGUIENTE_FLASH: Record<FlashMode, FlashMode> = { off: "on", on: "auto", auto: "off", screen: "off" };

export function useCamara() {
  const camara = useRef<CameraView>(null);
  const [permisoCamara, pedirCamara] = useCameraPermissions();
  const [permisoMic, pedirMic] = useMicrophonePermissions();

  const [lado, setLado] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [modo, setModo] = useState<Modo>("picture");
  const [linterna, setLinterna] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [captura, setCaptura] = useState<Captura | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cambiarModo = useCallback(
    async (nuevo: Modo) => {
      setModo(nuevo);
      setError(null);
      // para grabar con sonido hace falta el micrófono
      if (nuevo === "video" && !permisoMic?.granted) await pedirMic();
    },
    [permisoMic?.granted, pedirMic],
  );

  const sacarFoto = useCallback(async () => {
    try {
      const foto = await camara.current?.takePictureAsync({ quality: 0.8 });
      if (!foto) return;
      setCaptura({ uri: foto.uri, tipo: "picture" });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      setError("No se pudo sacar la foto. Probá de nuevo.");
    }
  }, []);

  const grabarVideo = useCallback(async () => {
    if (grabando) {
      camara.current?.stopRecording();
      return;
    }
    try {
      setGrabando(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      const video = await camara.current?.recordAsync({ maxDuration: 30 });
      if (video) setCaptura({ uri: video.uri, tipo: "video" });
    } catch {
      setError("No se pudo grabar el video.");
    } finally {
      setGrabando(false);
    }
  }, [grabando]);

  return {
    camara,
    permisoCamara,
    pedirCamara,
    lado,
    flash,
    modo,
    linterna,
    grabando,
    captura,
    error,
    cambiarModo,
    disparar: modo === "picture" ? sacarFoto : grabarVideo,
    voltear: () => setLado((l) => (l === "back" ? "front" : "back")),
    ciclarFlash: () => setFlash((f) => SIGUIENTE_FLASH[f]),
    alternarLinterna: () => setLinterna((l) => !l),
  };
}
