import { findByEmail } from "../../services/users/findUser.js";
import { updateUser } from "../../services/users/updateUser.js";
import { sendSession } from "../../utils/cookies.js";
import { hashPassword } from "../../utils/passwords.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, validateUser } from "../../validators/userValidator.js";

// el usuario edita sus propios datos; nunca puede cambiarse el rol
export async function updateProfile(req, res, next) {
  try {
    const { nombre, email, password } = req.body;

    const errors = validateUser({ nombre, email, password }, false);
    if (hasErrors(errors)) return res.status(400).json({ message: "Revisá los datos ingresados.", errors });

    const cleanEmail = normalizeEmail(email);
    const sameEmail = await findByEmail(cleanEmail);
    if (sameEmail && sameEmail.id !== req.user.id) return res.status(409).json({ message: "Ese email ya está registrado." });

    const passwordHash = password ? await hashPassword(password) : undefined;
    const user = await updateUser(req.user.id, { nombre, email: cleanEmail, passwordHash });
    sendSession(res, user);
  } catch (error) {
    next(error);
  }
}
