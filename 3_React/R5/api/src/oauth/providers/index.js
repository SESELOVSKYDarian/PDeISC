import { OAuthError } from "../oauthError.js";
import { discord } from "./discord.js";
import { github } from "./github.js";
import { google } from "./google.js";

const providers = { google, github, discord };

// devuelve el proveedor pedido o corta con un error claro
export function getProvider(name) {
  const provider = typeof name === "string" && Object.hasOwn(providers, name) ? providers[name] : null;

  if (!provider) throw new OAuthError(400, "Proveedor de ingreso no válido.");
  if (!provider.isConfigured()) throw new OAuthError(503, `El ingreso con ${provider.label} todavía no está configurado en el servidor.`);
  return provider;
}
