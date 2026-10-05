import { Usuario } from "../types/usuario";
import { post } from "./http";

export interface ResultadoLogin {
  usuario?: Usuario;
  mensaje?: string;
  errores?: Record<string, string>;
}

function resultado(r: Awaited<ReturnType<typeof post>>): ResultadoLogin {
  if (r.ok) return { usuario: r.usuario as Usuario };
  return { mensaje: r.mensaje, errores: r.errores };
}

export async function iniciarSesion(email: string, password: string): Promise<ResultadoLogin> {
  return resultado(await post("/auth/login", { email: email.trim(), password }));
}

export async function registrarse(nombre: string, email: string, password: string): Promise<ResultadoLogin> {
  return resultado(await post("/auth/registro", { nombre: nombre.trim(), email: email.trim(), password }));
}
