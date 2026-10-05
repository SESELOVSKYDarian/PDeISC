import LogOut from "lucide-react-native/icons/log-out";
import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/common/Button";
import Logo from "../components/common/Logo";
import LogoTile from "../components/common/LogoTile";
import ThemeToggle from "../components/common/ThemeToggle";
import Saludo from "../components/welcome/Saludo";
import UserCard from "../components/welcome/UserCard";
import { useTema } from "../theme/ThemeProvider";
import { ICONO } from "../theme/iconos";
import { Usuario } from "../types/usuario";

interface Props {
  usuario: Usuario;
  onSalir: () => void;
}

// desde 800px se parte en dos columnas (saludo + datos)
const ANCHO_ESCRITORIO = 800;

export default function WelcomeScreen({ usuario, onSalir }: Props) {
  const { colores } = useTema();
  const { width } = useWindowDimensions();
  const ancho = width >= ANCHO_ESCRITORIO;
  const primerNombre = usuario.nombre.split(" ")[0];

  return (
    <SafeAreaView style={[estilos.pantalla, { backgroundColor: colores.fondo }]}>
      <View style={[estilos.contenedor, ancho && estilos.fila]}>
        {ancho ? (
          <View style={[estilos.marca, { backgroundColor: colores.panelMarca }]}>
            <LogoTile tamano={120} />
            <Saludo nombre={primerNombre} colorTitulo={colores.panelMarcaTexto} colorTexto={colores.panelMarcaTexto} alineado="left" />
          </View>
        ) : null}

        <ScrollView style={estilos.lado} contentContainerStyle={estilos.scroll}>
          <View style={[estilos.barra, ancho && estilos.barraDerecha]}>
            {ancho ? null : <Logo texto={colores.texto} />}
            <ThemeToggle />
          </View>
          <View style={estilos.centro}>
            {ancho ? null : <Saludo nombre={primerNombre} colorTitulo={colores.texto} colorTexto={colores.textoSuave} />}
            <View style={estilos.columna}>
              <UserCard usuario={usuario} />
              <Button
                titulo="Cerrar sesión"
                variante="borde"
                onPress={onSalir}
                icono={<LogOut size={ICONO.md} color={colores.texto} />}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1 },
  contenedor: { flex: 1 },
  fila: { flexDirection: "row" },
  marca: { flex: 1, padding: 56, justifyContent: "space-between" },
  lado: { flex: 1 },
  scroll: { flexGrow: 1, padding: 20 },
  barra: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  barraDerecha: { justifyContent: "flex-end" },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 28, gap: 24 },
  columna: { width: "100%", maxWidth: 520, gap: 16 },
});
