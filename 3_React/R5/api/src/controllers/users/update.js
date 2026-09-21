import { findByEmail, findById } from "../../services/users/findUser.js";
import { updateUser } from "../../services/users/updateUser.js";
import { hashPassword } from "../../utils/passwords.js";
import { toId } from "../../utils/toId.js";
import { normalizeEmail } from "../../validators/emailValidator.js";
import { hasErrors, isValidRole, validateUser } from "../../validators/userValidator.js";

export async function update(req, res, next) {
  try {
    const { nombre, email, password, rol } = req.body;
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ message: "Usuario inválido." });
    if (!(await findById(id))) return res.status(404).json({ message: "Usuario no encontrado." });

    if (id === req.user.id && rol !== "administrador") {
      return res.status(400).json({ message: "No podés cambiar tu propio rol." });
    }

    const errors = validateUser({ nombre, email, password }, false);
    if (hasErrors(errors) || !isValidRole(rol)) return res.status(400).json({ message: "Datos inválidos.", errors });

    const cleanEmail = normalizeEmail(email);
    const sameEmail = await findByEmail(cleanEmail);
    if (sameEmail && sameEmail.id !== id) return res.status(409).json({ message: "Ese email ya está registrado." });

    const passwordHash = password ? await hashPassword(password) : undefined;
    res.json({ user: await updateUser(id, { nombre, email: cleanEmail, passwordHash, rol }) });
  } catch (error) {
    next(error);
  }
}
