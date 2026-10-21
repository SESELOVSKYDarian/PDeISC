import { StyleSheet, View } from "react-native";
import { PressableScale } from "@/components/common/PressableScale";
import { useTema } from "@/theme/ThemeProvider";

interface Props {
  modo: "picture" | "video";
  grabando: boolean;
  onPress: () => void;
}

// boton grande: blanco para foto, rojo para video
export function Obturador({ modo, grabando, onPress }: Props) {
  const { colores } = useTema();
  const rojo = modo === "video";

  return (
    <PressableScale
      onPress={onPress}
      escala={0.92}
      etiqueta={modo === "picture" ? "Sacar foto" : grabando ? "Detener grabación" : "Grabar video"}
      estilo={[estilos.anillo, { borderColor: colores.texto }]}
    >
      <View
        style={[
          estilos.centro,
          { backgroundColor: rojo ? colores.peligro : colores.texto },
          grabando && estilos.grabando,
        ]}
      />
    </PressableScale>
  );
}

const estilos = StyleSheet.create({
  anillo: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, alignItems: "center", justifyContent: "center" },
  centro: { width: 60, height: 60, borderRadius: 30 },
  grabando: { width: 30, height: 30, borderRadius: 8 },
});
