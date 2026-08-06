import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ dark, onToggle }) {
  // El botón cambia el tema sin agregar contenido al ejercicio.
  return (
    <button
      className="theme"
      type="button"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={onToggle}
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
