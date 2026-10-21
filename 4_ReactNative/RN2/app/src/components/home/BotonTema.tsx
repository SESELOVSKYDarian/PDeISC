import { Moon, Sun } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { PressableScale } from "@/components/common/PressableScale";
import { useTema } from "@/theme/ThemeProvider";

// alterna claro / oscuro (se guarda en AsyncStorage)
export function BotonTema() {
  const { modo, colores, alternar } = useTema();
  const Icono = modo === "oscuro" ? Sun : Moon;

  return (
    <PressableScale
      onPress={alternar}
      etiqueta={modo === "oscuro" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      estilo={[estilos.boton, { backgroundColor: colores.relleno }]}
    >
      <Icono size={22} color={colores.texto} />
    </PressableScale>
  );
}

const estilos = StyleSheet.create({
  boton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
