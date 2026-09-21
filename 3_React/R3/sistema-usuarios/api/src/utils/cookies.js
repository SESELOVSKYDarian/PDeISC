import { createToken } from "./token.js";

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 8 * 60 * 60 * 1000,
};

// guarda la sesión en una cookie httpOnly y responde con el usuario
export function sendSession(res, user, status = 200) {
  res.cookie("session", createToken(user), cookieOptions).status(status).json({ user });
}
