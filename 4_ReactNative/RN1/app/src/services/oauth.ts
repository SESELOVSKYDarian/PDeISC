import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Proveedor, Usuario } from "../types/usuario";
import { ResultadoLogin } from "./auth";
import { post } from "./http";

export interface InfoProveedor {
  nombre: Proveedor;
  label: string;
  disponible: boolean;
}

const ESPERA_MS = 3 * 60 * 1000;

let proveedoresGuardados: InfoProveedor[] | null = null;

// pido la lista una sola vez; si falla, se reintenta la próxima
export async function listarProveedores(): Promise<InfoProveedor[]> {
  if (proveedoresGuardados) return proveedoresGuardados;
  const r = await post("/oauth/proveedores", {});
  if (!r.ok) return [];
  proveedoresGuardados = r.proveedores as InfoProveedor[];
  return proveedoresGuardados;
}

// abre la red en el navegador integrado; devuelve la URL de vuelta o null si se canceló
async function abrirIntegrado(url: string, destino: string): Promise<string | null> {
  const sesion = await WebBrowser.openAuthSessionAsync(url, destino);
  return sesion.type === "success" ? sesion.url : null;
}

// plan B: abre el navegador por defecto del celular y espera el deep link de vuelta
function abrirExterno(url: string, destino: string): Promise<string | null> {
  return new Promise((resolver) => {
    const corte = setTimeout(() => { escucha.remove(); resolver(null); }, ESPERA_MS);
    const escucha = Linking.addEventListener("url", ({ url: vuelta }) => {
      if (!vuelta.startsWith(destino)) return;
      clearTimeout(corte);
      escucha.remove();
      resolver(vuelta);
    });
    Linking.openURL(url).catch(() => {
      clearTimeout(corte);
      escucha.remove();
      resolver(null);
    });
  });
}

// abre la red, vuelve con un ticket y lo cambia por el usuario
export async function ingresarConRed(proveedor: Proveedor): Promise<ResultadoLogin> {
  const destino = Linking.createURL("auth");
  const pedido = await post("/oauth/url", { proveedor, destino });
  if (!pedido.ok) return { mensaje: pedido.mensaje };
  const url = pedido.url as string;

  let vuelta: string | null;
  try {
    vuelta = await abrirIntegrado(url, destino);
  } catch {
    vuelta = await abrirExterno(url, destino); // no hay navegador compatible: pruebo con el de siempre
  }
  if (!vuelta) return { mensaje: "Cancelaste el ingreso" };

  const { ticket, error } = Linking.parse(vuelta).queryParams ?? {};
  if (typeof ticket !== "string") {
    return { mensaje: typeof error === "string" ? error : "No se pudo completar el ingreso" };
  }
  const canje = await post("/oauth/canjear", { ticket });
  if (canje.ok) return { usuario: canje.usuario as Usuario };
  return { mensaje: canje.mensaje };
}
