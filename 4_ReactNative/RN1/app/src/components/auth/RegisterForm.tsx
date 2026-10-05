import Mail from "lucide-react-native/icons/mail";
import User from "lucide-react-native/icons/user";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { registrarse } from "../../services/auth";
import { useTema } from "../../theme/ThemeProvider";
import { ICONO } from "../../theme/iconos";
import { Usuario } from "../../types/usuario";
import {
  validarConfirmacion, validarEmail, validarNombre, validarPasswordNueva,
} from "../../utils/validators";
import Button from "../common/Button";
import AuthLink from "./AuthLink";
import ErrorBanner from "./ErrorBanner";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";

interface Props {
  onRegistro: (usuario: Usuario) => void;
  onIrALogin: () => void;
}

const SIN_ERRORES = { nombre: "", email: "", password: "", confirmar: "" };
type Campo = keyof typeof SIN_ERRORES;

export default function RegisterForm({ onRegistro, onIrALogin }: Props) {
  const { colores } = useTema();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errores, setErrores] = useState(SIN_ERRORES);
  const [aviso, setAviso] = useState("");
  const [cargando, setCargando] = useState(false);

  const ponerError = (campo: Campo, mensaje: string) => setErrores((e) => ({ ...e, [campo]: mensaje }));

  // valido todos los campos; true si están bien
  function validar(): boolean {
    const nuevos = {
      nombre: validarNombre(nombre),
      email: validarEmail(email),
      password: validarPasswordNueva(password),
      confirmar: validarConfirmacion(password, confirmar),
    };
    setErrores(nuevos);
    return Object.values(nuevos).every((m) => !m);
  }

  async function enviar() {
    setAviso("");
    if (!validar()) return;
    setCargando(true);
    const r = await registrarse(nombre, email, password);
    setCargando(false);
    if (r.usuario) return onRegistro(r.usuario);
    if (r.errores) setErrores((e) => ({ ...e, ...r.errores }));
    setAviso(r.mensaje ?? "No se pudo crear la cuenta");
  }

  return (
    <View style={estilos.form}>
      <ErrorBanner mensaje={aviso} />
      <FormField
        etiqueta="Nombre"
        error={errores.nombre}
        icono={<User size={ICONO.md} color={colores.textoSuave} />}
        value={nombre}
        onChangeText={setNombre}
        onBlur={() => ponerError("nombre", validarNombre(nombre))}
        autoCapitalize="words"
        autoComplete="name"
        maxLength={80}
        returnKeyType="next"
      />
      <FormField
        etiqueta="Email"
        error={errores.email}
        icono={<Mail size={ICONO.md} color={colores.textoSuave} />}
        value={email}
        onChangeText={setEmail}
        onBlur={() => ponerError("email", validarEmail(email))}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        maxLength={120}
        returnKeyType="next"
      />
      <PasswordInput
        etiqueta="Creá una contraseña"
        valor={password}
        error={errores.password}
        onCambio={setPassword}
        onBlur={() => ponerError("password", validarPasswordNueva(password))}
        onEnviar={enviar}
        nueva
      />
      <PasswordInput
        etiqueta="Repetí la contraseña"
        valor={confirmar}
        error={errores.confirmar}
        onCambio={setConfirmar}
        onBlur={() => ponerError("confirmar", validarConfirmacion(password, confirmar))}
        onEnviar={enviar}
        nueva
      />
      <Button titulo="Crear cuenta" onPress={enviar} cargando={cargando} />
      <AuthLink pregunta="¿Ya tenés cuenta?" accion="Iniciá sesión" onPress={onIrALogin} />
    </View>
  );
}

const estilos = StyleSheet.create({
  form: { gap: 16, width: "100%" },
});
