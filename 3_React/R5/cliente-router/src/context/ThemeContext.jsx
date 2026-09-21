import { createContext, useContext, useEffect, useState } from "react";

const THEME_KEY = "usuarios-oauth-theme";
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // el tema elegido se recuerda en localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "light" ? "dark" : "light"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
