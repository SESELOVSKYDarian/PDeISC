import Eye from "lucide-react-native/icons/eye";
import EyeOff from "lucide-react-native/icons/eye-off";
import Lock from "lucide-react-native/icons/lock";
import { useState } from "react";
import { Pressable } from "react-native";
import { useTema } from "../../theme/ThemeProvider";
import { ICONO } from "../../theme/iconos";
import FormField from "./FormField";

interface Props {
  valor: string;
  error?: string;
  onCambio: (texto: string) => void;
  onBlur: () => void;
  onEnviar: () => void;
  etiqueta?: string;
  nueva?: boolean; // true en el registro (contraseña nueva)
}

export default function PasswordInput({
  valor, error, onCambio, onBlur, onEnviar, etiqueta = "Contraseña", nueva = false,
}: Props) {
  const { colores } = useTema();
  const [visible, setVisible] = useState(false);
  const Ojo = visible ? EyeOff : Eye;

  return (
    <FormField
      etiqueta={etiqueta}
      error={error}
      icono={<Lock size={ICONO.md} color={colores.textoSuave} />}
      derecha={
        <Pressable
          onPress={() => setVisible((v) => !v)}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          accessibilityState={{ selected: visible }}
        >
          <Ojo size={ICONO.md} color={colores.textoSuave} />
        </Pressable>
      }
      value={valor}
      onChangeText={onCambio}
      onBlur={onBlur}
      onSubmitEditing={onEnviar}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoComplete={nueva ? "new-password" : "current-password"}
      maxLength={72}
      returnKeyType="go"
    />
  );
}
