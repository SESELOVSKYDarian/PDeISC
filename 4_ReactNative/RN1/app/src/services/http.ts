import { apiUrl } from "./apiUrl";

export interface Respuesta {
  ok: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
  [clave: string]: unknown;
}

// la API solo usa POST
export async function post(ruta: string, cuerpo: object): Promise<Respuesta> {
  const control = new AbortController();
  const corte = setTimeout(() => control.abort(), 10000);
  try {
    const res = await fetch(`${apiUrl()}${ruta}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
      signal: control.signal,
    });
    return (await res.json()) as Respuesta;
  } catch {
    return { ok: false, mensaje: "No pude conectar con el servidor. Revisá que la API esté encendida." };
  } finally {
    clearTimeout(corte);
  }
}
