import { useEffect, useState } from "react";
import Particles from "./components/Particles";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/global.css";

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // Recordamos el tema elegido para la próxima visita.
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <main className="page">
      <Particles
        particleColors={[dark ? "#ffffff" : "#244b91"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      <h1 className="hello">Hola, Mundo</h1>
    </main>
  );
}
