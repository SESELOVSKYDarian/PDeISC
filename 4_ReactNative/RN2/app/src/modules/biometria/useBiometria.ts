import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";

export type Resultado = { ok: true } | { ok: false; motivo: string };

interface Estado {
  hardware: boolean;
  registrada: boolean;
  tipos: string[];
}

const NOMBRE_TIPO: Record<number, string> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: "Huella digital",
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: "Reconocimiento facial",
  [LocalAuthentication.AuthenticationType.IRIS]: "Iris",
};

const MOTIVOS: Record<string, string> = {
  user_cancel: "Cancelaste la verificación.",
  system_cancel: "El sistema canceló la verificación.",
  app_cancel: "La app canceló la verificación.",
  user_fallback: "Elegiste usar el código del teléfono.",
  not_enrolled: "No hay huella ni rostro registrados en el teléfono.",
  lockout: "Demasiados intentos. Probá más tarde.",
  authentication_failed: "No te reconocimos. Probá de nuevo.",
  not_available: "La biometría no está disponible.",
};

export function useBiometria() {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [verificando, setVerificando] = useState(false);

  // leo qué soporta el teléfono
  useEffect(() => {
    async function leer() {
      const hardware = await LocalAuthentication.hasHardwareAsync();
      const registrada = await LocalAuthentication.isEnrolledAsync();
      const codigos = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setEstado({ hardware, registrada, tipos: codigos.map((c) => NOMBRE_TIPO[c] ?? "Otro") });
    }
    leer().catch(() => setEstado({ hardware: false, registrada: false, tipos: [] }));
  }, []);

  const autenticar = useCallback(async () => {
    setVerificando(true);
    setResultado(null);
    try {
      const r = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirmá que sos vos",
        cancelLabel: "Cancelar",
      });
      if (r.success) {
        setResultado({ ok: true });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        setResultado({ ok: false, motivo: MOTIVOS[r.error] ?? "No se pudo verificar." });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
    } catch {
      setResultado({ ok: false, motivo: "Ocurrió un error al verificar." });
    } finally {
      setVerificando(false);
    }
  }, []);

  return { estado, resultado, verificando, autenticar };
}
