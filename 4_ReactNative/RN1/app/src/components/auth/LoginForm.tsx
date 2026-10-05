import Mail from "lucide-react-native/icons/mail";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { iniciarSesion } from "../../services/auth";
import { ingresarConRed } from "../../services/oauth";
import { useTema } from "../../theme/ThemeProvider";
import { ICONO } from "../../theme/iconos";
import { Proveedor, Usuario } from "../../types/usuario";
import { validarEmail, validarPassword } from "../../utils/validators";
import Button from "../common/Button";
import AuthLink from "./AuthLink";
import ErrorBanner from "./ErrorBanner";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";
import SocialButtons from "./SocialButtons";

interface Props {
  onIngreso: (usuario: Usuario) => void;
  onIrARegistro: () => void;
}

export default function LoginForm({ onIngreso, onIrARegistro }: Props) {
  const { colores } = useTema();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({ email: "", password: "" });
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);

  // valido ambos campos; devuelve true si están bien
  function validar(): boolean {
    const nuevos = { email: validarEmail(email), password: validarPassword(password) };
    setErrores(nuevos);
    return !nuevos.email && !nuevos.password;
  }

  async function enviar() {
    setAviso("");
    if (!validar()) return;
    setCargando(true);
    const r = await iniciarSesion(email, password);
    setCargando(false);
    if (r.usuario) return onIngreso(r.usuario);
    if (r.errores) setErrores({ email: r.errores.email ?? "", password: r.errores.password ?? "" });
    setAviso(r.mensaje ?? "No se pudo ingresar");
  }

  async function ingresarConProveedor(proveedor: Proveedor) {
    setAviso("");
    setCargando(true);
    const r = await ingresarConRed(proveedor);
    setCargando(false);
    if (r.usuario) return onIngreso(r.usuario);
    setAviso(r.mensaje ?? "No se pudo ingresar");
  }

  return (
    <View style={estilos.form}>
      <ErrorBanner mensaje={aviso} />
      <FormField
        etiqueta="Email"
        error={errores.email}
        icono={<Mail size={ICONO.md} color={colores.textoSuave} />}
        value={email}
        onChangeText={setEmail}
        onBlur={() => setErrores((e) => ({ ...e, email: validarEmail(email) }))}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        maxLength={120}
        returnKeyType="next"
      />
      <PasswordInput
        valor={password}
        error={errores.password}
        onCambio={setPassword}
        onBlur={() => setErrores((e) => ({ ...e, password: validarPassword(password) }))}
        onEnviar={enviar}
      />
      <Button titulo="Ingresar" onPress={enviar} cargando={cargando} />
      <SocialButtons ocupado={cargando} onElegir={ingresarConProveedor} />
      <AuthLink pregunta="¿No tenés cuenta?" accion="Registrate" onPress={onIrARegistro} />
    </View>
  );
}

const estilos = StyleSheet.create({
  form: { gap: 16, width: "100%" },
});
