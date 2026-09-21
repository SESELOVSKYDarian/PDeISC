import { cookieOptions } from "../../utils/cookies.js";

export function logout(_req, res) {
  res.clearCookie("session", cookieOptions).json({ message: "Sesión cerrada." });
}
