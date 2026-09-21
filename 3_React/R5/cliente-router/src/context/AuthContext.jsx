import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, logoutRequest, oauthCallbackRequest, registerRequest, sessionRequest } from "@/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // al abrir la app pregunto si ya hay una sesión activa (cookie)
  useEffect(() => {
    sessionRequest()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(values) {
    const loggedUser = await loginRequest(values);
    setUser(loggedUser);
    return loggedUser;
  }

  async function register(values) {
    const newUser = await registerRequest(values);
    setUser(newUser);
    return newUser;
  }

  // vuelta del ingreso con Google, GitHub o Meta
  async function oauthLogin(values) {
    const oauthUser = await oauthCallbackRequest(values);
    setUser(oauthUser);
    return oauthUser;
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  const value = { user, setUser, loading, login, register, oauthLogin, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
