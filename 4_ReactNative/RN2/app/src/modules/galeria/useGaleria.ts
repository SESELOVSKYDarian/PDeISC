import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";

export function useGaleria() {
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [error, setError] = useState<string | null>(null);

  const guardarResultado = useCallback((r: ImagePicker.ImagePickerResult) => {
    if (!r.canceled) setImagen(r.assets[0]);
  }, []);

  const elegir = useCallback(async () => {
    setError(null);
    try {
      guardarResultado(await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1 }));
    } catch {
      setError("No se pudo abrir la galería.");
    }
  }, [guardarResultado]);

  const sacar = useCallback(async () => {
    setError(null);
    try {
      const permiso = await ImagePicker.requestCameraPermissionsAsync();
      if (!permiso.granted) {
        setError("Sin permiso de cámara. Activalo desde los ajustes del teléfono.");
        return;
      }
      guardarResultado(await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 1 }));
    } catch {
      setError("No se pudo abrir la cámara.");
    }
  }, [guardarResultado]);

  return { imagen, error, elegir, sacar };
}
