import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { claro, Colores, oscuro } from "./colors";

type Modo = "claro" | "oscuro";
const CLAVE = "depaso.tema";

interface TemaValor {
  modo: Modo;
  colores: Colores;
  alternar: () => void;
}

const TemaContext = createContext<TemaValor | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const sistema = useColorScheme();
  const [modo, setModo] = useState<Modo>(sistema === "dark" ? "oscuro" : "claro");

  // recupero la preferencia guardada
  useEffect(() => {
    AsyncStorage.getItem(CLAVE)
      .then((guardado) => {
        if (guardado === "claro" || guardado === "oscuro") setModo(guardado);
      })
      .catch(() => {});
  }, []);

  function alternar() {
    const nuevo: Modo = modo === "claro" ? "oscuro" : "claro";
    setModo(nuevo);
    AsyncStorage.setItem(CLAVE, nuevo).catch(() => {});
  }

  const valor = { modo, colores: modo === "claro" ? claro : oscuro, alternar };
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema(): TemaValor {
  const valor = useContext(TemaContext);
  if (!valor) throw new Error("useTema va dentro de ThemeProvider");
  return valor;
}
