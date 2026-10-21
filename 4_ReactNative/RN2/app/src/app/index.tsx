import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { Logo } from "@/components/common/Logo";
import { Grupo } from "@/components/common/Grupo";
import { Pantalla } from "@/components/common/Pantalla";
import { BotonTema } from "@/components/home/BotonTema";
import { FilaHerramienta } from "@/components/home/FilaHerramienta";
import { herramientas, seccionesDeHerramientas } from "@/data/herramientas";
import { useTema } from "@/theme/ThemeProvider";
import { espacio, tipo } from "@/theme/medidas";

const SALIDA_SUAVE = Easing.bezier(0.23, 1, 0.32, 1);

export default function Inicio() {
  const { colores } = useTema();
  const secciones = seccionesDeHerramientas();

  return (
    <Pantalla conTopInset>
      <View style={estilos.cabecera}>
        <Logo tamano={44} color={colores.acento} />
        <View style={estilos.titulos}>
          <Text style={[tipo.tituloGrande, { color: colores.texto }]}>SensorLab</Text>
          <Text style={[tipo.cuerpo, { color: colores.textoSecundario }]}>
            {herramientas.length} herramientas de tu celular
          </Text>
        </View>
        <BotonTema />
      </View>

      {secciones.map((seccion, i) => (
        <Animated.View key={seccion.nombre} entering={FadeInDown.delay(i * 60).duration(320).easing(SALIDA_SUAVE)}>
          <Grupo titulo={seccion.nombre}>
            {seccion.items.map((h) => (
              <FilaHerramienta key={h.ruta} herramienta={h} />
            ))}
          </Grupo>
        </Animated.View>
      ))}
    </Pantalla>
  );
}

const estilos = StyleSheet.create({
  cabecera: { flexDirection: "row", alignItems: "center", gap: espacio.m, paddingTop: espacio.s, paddingBottom: espacio.s },
  titulos: { flex: 1, gap: espacio.xs },
});
