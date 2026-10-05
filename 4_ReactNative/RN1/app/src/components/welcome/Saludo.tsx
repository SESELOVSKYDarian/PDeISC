import { StyleSheet, Text, View } from "react-native";
import FadeIn from "../common/FadeIn";

interface Props {
  nombre: string;
  colorTitulo: string;
  colorTexto: string;
  alineado?: "center" | "left";
}

// saludo de la bienvenida; los colores dependen de dónde se dibuje
export default function Saludo({ nombre, colorTitulo, colorTexto, alineado = "center" }: Props) {
  return (
    <FadeIn>
      <View>
        <Text style={[estilos.titulo, { color: colorTitulo, textAlign: alineado }]}>¡Hola, {nombre}!</Text>
        <Text style={[estilos.texto, { color: colorTexto, textAlign: alineado }]}>
          Ingresaste bien a DePaso. Estos son tus datos.
        </Text>
      </View>
    </FadeIn>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 36, fontWeight: "800", letterSpacing: -0.8 },
  texto: { fontSize: 17, marginTop: 6 },
});
