import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ dark, onToggle }) {
  // Este control pertenece a este proyecto y no comparte estado con los demás.
  return (
    <button
      className="theme"
      aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
      type="button"
      onClick={onToggle}
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}
