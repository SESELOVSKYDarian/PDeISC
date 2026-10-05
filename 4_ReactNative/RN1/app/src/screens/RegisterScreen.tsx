import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import { Usuario } from "../types/usuario";

interface Props {
  onRegistro: (usuario: Usuario) => void;
  onIrALogin: () => void;
}

export default function RegisterScreen({ onRegistro, onIrALogin }: Props) {
  return (
    <AuthLayout titulo="Creá tu cuenta" subtitulo="Sumate a DePaso en un minuto.">
      <RegisterForm onRegistro={onRegistro} onIrALogin={onIrALogin} />
    </AuthLayout>
  );
}
