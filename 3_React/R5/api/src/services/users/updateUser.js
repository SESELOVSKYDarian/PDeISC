import { pool } from "../db.js";
import { findById } from "./findUser.js";

// solo actualiza la contraseña o el rol si vienen con valor
export async function updateUser(id, { nombre, email, passwordHash, rol }) {
  const fields = ["nombre = ?", "email = ?"];
  const values = [nombre.trim(), email];

  if (passwordHash) {
    fields.push("password_hash = ?");
    values.push(passwordHash);
  }
  if (rol) {
    fields.push("rol_id = (SELECT id FROM roles WHERE nombre = ?)");
    values.push(rol);
  }

  await pool.execute(`UPDATE usuarios SET ${fields.join(", ")} WHERE id = ?`, [...values, id]);
  return findById(id);
}
