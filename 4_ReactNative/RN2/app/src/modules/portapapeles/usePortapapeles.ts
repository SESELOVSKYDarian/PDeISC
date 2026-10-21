import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Share } from "react-native";
import { useMensaje } from "@/hooks/useMensaje";

export function usePortapapeles() {
  const [texto, setTexto] = useState("");
  const { mensaje, mostrar } = useMensaje();

  // valido que haya algo escrito antes de actuar
  function hayTexto(): boolean {
    if (texto.trim().length === 0) {
      mostrar("error", "Escribí algo primero.");
      return false;
    }
    return true;
  }

  async function copiar() {
    if (!hayTexto()) return;
    await Clipboard.setStringAsync(texto);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    mostrar("exito", "Texto copiado");
  }

  async function pegar() {
    const pegado = await Clipboard.getStringAsync();
    if (!pegado) {
      mostrar("info", "El portapapeles está vacío.");
      return;
    }
    setTexto(pegado);
    mostrar("exito", "Texto pegado");
  }

  async function compartir() {
    if (!hayTexto()) return;
    try {
      await Share.share({ message: texto });
    } catch {
      mostrar("error", "No se pudo compartir.");
    }
  }

  return { texto, setTexto, mensaje, copiar, pegar, compartir, limpiar: () => setTexto("") };
}
