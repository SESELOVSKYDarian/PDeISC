import Hash from "lucide-react-native/icons/hash";
import Mail from "lucide-react-native/icons/mail";
import ShieldCheck from "lucide-react-native/icons/shield-check";
import { StyleSheet, Text, View } from "react-native";
import { useTema } from "../../theme/ThemeProvider";
import { ICONO } from "../../theme/iconos";
import { Usuario } from "../../types/usuario";
import FadeIn from "../common/FadeIn";
import InfoRow from "./InfoRow";

// recibe el usuario por props desde la pantalla de bienvenida
export default function UserCard({ usuario }: { usuario: Usuario }) {
  const { colores } = useTema();
  const inicial = usuario.nombre.trim().charAt(0).toUpperCase() || "?";
  const icono = { size: ICONO.md, color: colores.textoSuave };

  return (
    <View style={[estilos.tarjeta, { backgroundColor: colores.superficie, borderColor: colores.borde }]}>
      <FadeIn>
        <View style={estilos.cabecera}>
          <View style={[estilos.avatar, { backgroundColor: colores.acento }]}>
            <Text style={[estilos.inicial, { color: colores.acentoTexto }]}>{inicial}</Text>
          </View>
          <Text style={[estilos.nombre, { color: colores.texto }]}>{usuario.nombre}</Text>
        </View>
      </FadeIn>
      <View style={estilos.filas}>
        <FadeIn delay={60}><InfoRow icono={<Mail {...icono} />} etiqueta="Email" valor={usuario.email} /></FadeIn>
        <FadeIn delay={120}><InfoRow icono={<ShieldCheck {...icono} />} etiqueta="Rol" valor={usuario.rol} /></FadeIn>
        <FadeIn delay={180}><InfoRow icono={<Hash {...icono} />} etiqueta="ID de usuario" valor={String(usuario.id)} /></FadeIn>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: { width: "100%", borderRadius: 24, borderWidth: 1, padding: 22, gap: 20 },
  cabecera: { alignItems: "center", gap: 12 },
  avatar: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center" },
  inicial: { fontSize: 34, fontWeight: "800" },
  nombre: { fontSize: 24, fontWeight: "800", textAlign: "center" },
  filas: { gap: 10 },
});
