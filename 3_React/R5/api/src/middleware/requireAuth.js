import { findById } from "../services/users/findUser.js";
import { verifyToken } from "../utils/token.js";

// valida la cookie y carga el usuario real (con su rol actual) desde la BBDD
export async function requireAuth(req, res, next) {
  try {
    const { id } = verifyToken(req.cookies.session);
    const user = await findById(id);
    if (!user) return res.status(401).json({ message: "Tu sesión venció o no es válida." });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Tu sesión venció o no es válida." });
  }
}
