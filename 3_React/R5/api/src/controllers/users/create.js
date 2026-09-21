import { createUser } from "../../services/users/createUser.js";
import { findByEmail } from "../../services/users/findUser.js";
import { hashPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, isValidRole, validateUser } from "../../validators/userValidator.js";

export async function create(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;

    const errors = validateUser({ nombre, email, password });
    if (hasErrors(errors) || !isValidRole(rol)) return res.status(400).json({ message: "Datos inválidos.", errors });

    const cleanEmail = normalizeEmail(email);
    if (await findByEmail(cleanEmail)) return res.status(409).json({ message: "Ese email ya está registrado." });

    const passwordHash = await hashPassword(password);
    const user = await createUser({ nombre, email: cleanEmail, passwordHash, rol });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
}
