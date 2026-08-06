import { useCallback, useEffect, useState } from "react";
import FormularioUsuario from "./components/FormularioUsuario";
import Galaxy from "./components/Galaxy";
import PantallaBienvenida from "./components/PantallaBienvenida";
import ThemeToggle from "./components/ThemeToggle";
import "./global.css";

export default function App() {
  const [dark, setDark] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  const showWelcome = useCallback((message) => setWelcomeMessage(message), []);
  return (
    <main>
      <Galaxy
        mouseRepulsion
        mouseInteraction
        density={1}
        glowIntensity={0.3}
        saturation={0}
        hueShift={140}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        repulsionStrength={2}
        starSpeed={0.5}
        speed={1}
      />
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      {welcomeMessage ? (
        <PantallaBienvenida
          message={welcomeMessage}
          onBack={() => setWelcomeMessage("")}
        />
      ) : (
        <FormularioUsuario onWelcome={showWelcome} />
      )}
    </main>
  );
}
