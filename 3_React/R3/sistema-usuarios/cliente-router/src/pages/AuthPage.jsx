import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { useAuthRequest } from "@/hooks/useAuthRequest";
import { homePath } from "@/utils/homePath";

// login (mode = "login") y registro (mode = "register")
export default function AuthPage({ mode }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { busy, message, send } = useAuthRequest();
  const isRegister = mode === "register";

  async function submit(values) {
    const user = await send(isRegister ? register : login, values);
    if (user) navigate(homePath(user));
  }

  return (
    <AuthForm
      mode={mode}
      busy={busy}
      message={message}
      onSubmit={submit}
      onSwitch={() => navigate(isRegister ? "/ingresar" : "/registro")}
    />
  );
}
