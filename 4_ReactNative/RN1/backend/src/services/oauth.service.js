import { config } from "../config.js";
import { providers, redirectUri } from "../oauth/providers.js";
import { estados, tickets } from "../oauth/store.js";
import {
  buscarPorEmail, buscarPorIdentidad, crearUsuario, publico, vincularIdentidad,
} from "./users.service.js";

// la app solo vuelve a estos destinos (evita redirecciones abiertas)
const DESTINO_OK = /^(exp|exps|depaso):\/\/|^https?:\/\/(localhost|127\.0\.0\.1|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/|$)/;

export const destinoValido = (url) => typeof url === "string" && url.length < 300 && DESTINO_OK.test(url);

export function lista() {
  return Object.entries(providers).map(([nombre, p]) => ({ nombre, label: p.label, disponible: p.disponible() }));
}

// la app nativa vuelve por https al nip.io; la web por localhost
const NATIVO = /^(exp|exps|depaso):\/\//;
const esNativo = (destino) => NATIVO.test(destino);

// arma la URL de la red y recuerda a dónde volver
export function urlDeIngreso(nombre, destino) {
  const base = esNativo(destino) && config.movilBase ? config.movilBase : config.redirectBase;
  const uri = redirectUri(nombre, base);
  const state = estados.guardar({ nombre, destino, uri });
  return providers[nombre].url(state, uri);
}

// busca la persona por su identidad, la une por email verificado, o la crea
async function resolverUsuario(nombre, perfil) {
  const porIdentidad = await buscarPorIdentidad(nombre, perfil.uid);
  if (porIdentidad) return porIdentidad;

  if (!perfil.email || !perfil.verificado) {
    throw new Error("La red no entregó un email verificado");
  }
  const email = perfil.email.toLowerCase();
  let usuario = await buscarPorEmail(email);
  if (!usuario) {
    const id = await crearUsuario({ nombre: perfil.nombre || email.split("@")[0], email });
    usuario = await buscarPorEmail(email);
    if (!usuario) throw new Error(`No se pudo crear el usuario ${id}`);
  }
  await vincularIdentidad(usuario.id, nombre, perfil.uid);
  return usuario;
}

// termino la vuelta de la red: valido el state, canjeo el código y dejo un ticket
// devuelve { destino, ticket } o { destino, error }
export async function completarIngreso(nombre, code, state) {
  const guardado = estados.sacar(state);
  if (!guardado || guardado.nombre !== nombre) {
    return { destino: null, error: "La verificación de seguridad falló" };
  }
  try {
    if (typeof code !== "string" || !code) throw new Error("Falta el código de la red");
    const perfil = await providers[nombre].perfil(code, guardado.uri); // misma URL que en el pedido
    const usuario = await resolverUsuario(nombre, perfil);
    return { destino: guardado.destino, ticket: tickets.guardar(publico(usuario)) };
  } catch (error) {
    console.error(`[oauth:${nombre}]`, error.message);
    return { destino: guardado.destino, error: "No se pudo completar el ingreso" };
  }
}

export const canjearTicket = (ticket) => tickets.sacar(ticket);
