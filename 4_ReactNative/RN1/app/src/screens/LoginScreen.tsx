import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import { Usuario } from "../types/usuario";

interface Props {
  onIngreso: (usuario: Usuario) => void;
  onIrARegistro: () => void;
}

export default function LoginScreen({ onIngreso, onIrARegistro }: Props) {
  return (
    <AuthLayout titulo="Iniciá sesión" subtitulo="Ahorrá en el camino, en serio.">
      <LoginForm onIngreso={onIngreso} onIrARegistro={onIrARegistro} />
    </AuthLayout>
  );
}
