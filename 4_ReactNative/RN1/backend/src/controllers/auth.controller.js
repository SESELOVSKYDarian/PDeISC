import { iniciarSesion, registrar } from "../services/auth.service.js";
import { validarLogin, validarRegistro } from "../validators/auth.validator.js";

const datosInvalidos = (res, errores) =>
  res.status(400).json({ ok: false, mensaje: "Datos inválidos", errores });

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { errores, datos } = validarLogin(req.body);
    if (Object.keys(errores).length) return datosInvalidos(res, errores);

    const usuario = await iniciarSesion(datos.email, datos.password);
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: "Email o contraseña incorrectos" });
    }
    res.json({ ok: true, usuario });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/registro
export async function registro(req, res, next) {
  try {
    const { errores, datos } = validarRegistro(req.body);
    if (Object.keys(errores).length) return datosInvalidos(res, errores);

    const usuario = await registrar(datos);
    if (!usuario) {
      return res.status(409).json({
        ok: false,
        mensaje: "Ese email ya tiene una cuenta",
        errores: { email: "Ese email ya está registrado" },
      });
    }
    res.status(201).json({ ok: true, usuario });
  } catch (error) {
    next(error);
  }
}
