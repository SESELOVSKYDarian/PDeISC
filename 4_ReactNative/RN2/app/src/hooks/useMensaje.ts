import { useCallback, useEffect, useRef, useState } from "react";

export interface Mensaje {
  clase: "info" | "error" | "exito";
  texto: string;
}

// mensaje temporal en pantalla (se borra solo a los 3 segundos)
export function useMensaje() {
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrar = useCallback((clase: Mensaje["clase"], texto: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMensaje({ clase, texto });
    timer.current = setTimeout(() => setMensaje(null), 3000);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { mensaje, mostrar };
}
