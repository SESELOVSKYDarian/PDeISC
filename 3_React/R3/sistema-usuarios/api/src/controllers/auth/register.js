import { createUser } from "../../services/users/createUser.js";
import { findByEmail } from "../../services/users/findUser.js";
import { sendSession } from "../../utils/cookies.js";
import { hashPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, validateUser } from "../../validators/userValidator.js";

export async function register(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    const errors = validateUser({ nombre, email, password });
    if (hasErrors(errors)) return res.status(400).json({ message: "Revisá los datos ingresados.", errors });

    const cleanEmail = normalizeEmail(email);
    if (await findByEmail(cleanEmail)) return res.status(409).json({ message: "Ese email ya está registrado." });

    const passwordHash = await hashPassword(password);
    const user = await createUser({ nombre, email: cleanEmail, passwordHash });
    sendSession(res, user, 201);
  } catch (error) {
    next(error);
  }
}
