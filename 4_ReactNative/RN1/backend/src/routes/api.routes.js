import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, registro } from "../controllers/auth.controller.js";
import { canjear, proveedores, url } from "../controllers/oauth.controller.js";

const router = Router();

// freno a la fuerza bruta y al spam de cuentas, por IP cada 15 min
const limite = (cantidad) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: cantidad,
    handler: (req, res) => res.status(429).json({ ok: false, mensaje: "Demasiados intentos, probá más tarde" }),
  });

// todo es POST, incluso listar
router.post("/auth/login", limite(20), login);
router.post("/auth/registro", limite(10), registro);
router.post("/oauth/proveedores", proveedores);
router.post("/oauth/url", url);
router.post("/oauth/canjear", canjear);

export default router;
