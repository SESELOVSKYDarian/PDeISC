import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { ThemeProvider, useTema } from "./src/theme/ThemeProvider";
import { Usuario } from "./src/types/usuario";

// cierra la ventana de la red al volver (web)
WebBrowser.maybeCompleteAuthSession();

type Pagina = "login" | "registro";

function Paginas() {
  const { modo } = useTema();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pagina, setPagina] = useState<Pagina>("login");

  function salir() {
    setUsuario(null);
    setPagina("login");
  }

  return (
    <>
      <StatusBar style={modo === "claro" ? "dark" : "light"} />
      {usuario ? (
        <WelcomeScreen usuario={usuario} onSalir={salir} />
      ) : pagina === "registro" ? (
        <RegisterScreen onRegistro={setUsuario} onIrALogin={() => setPagina("login")} />
      ) : (
        <LoginScreen onIngreso={setUsuario} onIrARegistro={() => setPagina("registro")} />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Paginas />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
