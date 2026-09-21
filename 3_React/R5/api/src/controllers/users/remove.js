import { findById } from "../../services/users/findUser.js";
import { removeUser } from "../../services/users/removeUser.js";
import { toId } from "../../utils/toId.js";

export async function remove(req, res, next) {
  try {
    const id = toId(req.body.id);
    if (!id) return res.status(400).json({ message: "Usuario inválido." });
    if (id === req.user.id) return res.status(400).json({ message: "No podés eliminar tu propia cuenta." });
    if (!(await findById(id))) return res.status(404).json({ message: "Usuario no encontrado." });

    await removeUser(id);
    res.json({ message: "Usuario eliminado." });
  } catch (error) {
    next(error);
  }
}
