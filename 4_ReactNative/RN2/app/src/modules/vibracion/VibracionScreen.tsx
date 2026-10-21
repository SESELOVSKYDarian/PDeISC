import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";
import { Boton } from "@/components/common/Boton";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { Aviso } from "@/components/common/Aviso";
import { FilaAccion } from "./FilaAccion";

const IMPACTOS = [
  { texto: "Suave", estilo: Haptics.ImpactFeedbackStyle.Soft },
  { texto: "Ligero", estilo: Haptics.ImpactFeedbackStyle.Light },
  { texto: "Medio", estilo: Haptics.ImpactFeedbackStyle.Medium },
  { texto: "Fuerte", estilo: Haptics.ImpactFeedbackStyle.Heavy },
  { texto: "Rígido", estilo: Haptics.ImpactFeedbackStyle.Rigid },
];

const AVISOS = [
  { texto: "Éxito", tipo: Haptics.NotificationFeedbackType.Success },
  { texto: "Advertencia", tipo: Haptics.NotificationFeedbackType.Warning },
  { texto: "Error", tipo: Haptics.NotificationFeedbackType.Error },
];

export default function VibracionScreen() {
  return (
    <Pantalla>
      {Platform.OS === "ios" ? <Aviso texto="En iPhone, el modo silencio o el ahorro de energía pueden apagar la vibración." /> : null}

      <Grupo titulo="Impacto">
        {IMPACTOS.map((i) => (
          <FilaAccion key={i.texto} texto={i.texto} onPress={() => Haptics.impactAsync(i.estilo)} />
        ))}
      </Grupo>

      <Grupo titulo="Notificación">
        {AVISOS.map((a) => (
          <FilaAccion key={a.texto} texto={a.texto} onPress={() => Haptics.notificationAsync(a.tipo)} />
        ))}
      </Grupo>

      <Grupo titulo="Selección">
        <FilaAccion texto="Tick de selector" onPress={() => Haptics.selectionAsync()} />
      </Grupo>

      <Boton texto="Vibración larga" variante="suave" onPress={() => Vibration.vibrate([0, 120, 80, 120, 80, 300])} />
    </Pantalla>
  );
}
