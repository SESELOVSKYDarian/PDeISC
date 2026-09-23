import { config } from "../config.js";

// la vuelta del proveedor cae en una pantalla del cliente; debe ser idéntica en el pedido y en el canje del código.
// Cada red puede tener su propia dirección base (por ejemplo, Facebook en https) con <RED>_REDIRECT_BASE.
export const redirectUri = (providerName) => `${config.oauth[providerName]?.redirectBase || config.clientUrl}/auth/${providerName}/callback`;
