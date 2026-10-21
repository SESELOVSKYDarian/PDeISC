import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconoHerramienta } from "@/components/common/IconoHerramienta";
import { Herramienta } from "@/data/herramientas";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";

// fila del inicio: al apretar se resalta y navega
export function FilaHerramienta({ herramienta }: { herramienta: Herramienta }) {
  const { colores } = useTema();

  return (
    <Pressable
      onPress={() => router.push(`/${herramienta.ruta}`)}
      accessibilityRole="button"
      accessibilityLabel={`${herramienta.titulo}. ${herramienta.detalle}`}
      style={({ pressed }) => [estilos.fila, pressed && { backgroundColor: colores.relleno }]}
    >
      <IconoHerramienta icono={herramienta.icono} color={herramienta.color} />
      <View style={estilos.textos}>
        <Text style={[tipo.cuerpo, { color: colores.texto }]}>{herramienta.titulo}</Text>
        <Text style={[tipo.detalle, { color: colores.textoSecundario }]}>{herramienta.detalle}</Text>
      </View>
      <ChevronRight size={20} color={colores.textoSecundario} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    minHeight: 68,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s + 2,
    flexDirection: "row",
    alignItems: "center",
    gap: espacio.m,
  },
  textos: { flex: 1, gap: 2 },
});
