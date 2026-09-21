import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookieOptions } from "../utils/cookies.js";
import { OAuthError } from "./oauthError.js";

const COOKIE = "oauth_state";
const { maxAge, ...clearOptions } = cookieOptions;
const stateCookie = { ...clearOptions, maxAge: 10 * 60 * 1000 };

// crea el "state" anti-CSRF y lo deja en una cookie httpOnly
export function startState(res, providerName) {
  const state = randomBytes(24).toString("hex");
  res.cookie(COOKIE, `${providerName}.${state}`, stateCookie);
  return state;
}

// el state que vuelve del proveedor tiene que coincidir con el de la cookie (se usa una sola vez)
export function checkState(req, res, providerName, state) {
  const saved = req.cookies[COOKIE];
  res.clearCookie(COOKIE, clearOptions);

  const expected = Buffer.from(`${providerName}.${typeof state === "string" ? state : ""}`);
  const actual = Buffer.from(typeof saved === "string" ? saved : "");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new OAuthError(400, "La verificación de seguridad falló. Volvé a intentar el ingreso.");
  }
}
