import { providers } from "../oauth/providers.js";
import {
  canjearTicket, completarIngreso, destinoValido, lista, urlDeIngreso,
} from "../services/oauth.service.js";

// POST /api/oauth/proveedores
export const proveedores = (req, res) => res.json({ ok: true, proveedores: lista() });

// POST /api/oauth/url { proveedor, destino }
export function url(req, res) {
  const { proveedor, destino } = req.body ?? {};
  const red = providers[proveedor];
  if (!Object.hasOwn(providers, proveedor) || !red.disponible()) {
    return res.status(400).json({ ok: false, mensaje: "Proveedor no disponible" });
  }
  if (!destinoValido(destino)) {
    return res.status(400).json({ ok: false, mensaje: "Destino de retorno inválido" });
  }
  res.json({ ok: true, url: urlDeIngreso(proveedor, destino) });
}

// POST /api/oauth/canjear { ticket }
export function canjear(req, res) {
  const usuario = typeof req.body?.ticket === "string" ? canjearTicket(req.body.ticket) : null;
  if (!usuario) return res.status(401).json({ ok: false, mensaje: "El ticket venció o no es válido" });
  res.json({ ok: true, usuario });
}

const paginaError = (mensaje) =>
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
  `<body style="font-family:sans-serif;padding:2rem"><h2>DePaso</h2><p>${mensaje}</p><p>Volvé a la app.</p>`;

// GET /auth/:proveedor/callback — es GET porque así vuelve la red (lo manda el estándar OAuth)
export async function callback(req, res) {
  const { proveedor } = req.params;
  if (!Object.hasOwn(providers, proveedor)) return res.status(404).send(paginaError("Proveedor desconocido"));

  const { code, state } = req.query;
  const r = await completarIngreso(proveedor, code, state);
  if (!r.destino) return res.status(400).send(paginaError(r.error));

  const volver = new URL(r.destino);
  volver.searchParams.set(r.ticket ? "ticket" : "error", r.ticket ?? r.error);
  res.redirect(volver.toString());
}
