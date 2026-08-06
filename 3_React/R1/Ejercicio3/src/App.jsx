import { useEffect, useState } from "react";
import Contador from "./components/Contador";
import LetterGlitch from "./components/LetterGlitch";
import ThemeToggle from "./components/ThemeToggle";
import "./global.css";

export default function App() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  const colors = dark
    ? ["#2b4539", "#61dca3", "#61b3dc"]
    : ["#315b85", "#438fc2", "#79c2d8"];
  return (
    <main>
      <div className="letter-background">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={dark}
          outerVignette={!dark}
          smooth
          glitchColors={colors}
        />
      </div>
      <ThemeToggle dark={dark} onToggle={() => setDark((value) => !value)} />
      <Contador />
    </main>
  );
}
