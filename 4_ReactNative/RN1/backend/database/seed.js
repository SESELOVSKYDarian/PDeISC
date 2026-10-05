import bcrypt from "bcrypt";

const ROLES = ["admin", "usuario"];
const PROVEEDORES = ["google", "discord", "facebook"];

// usuarios de prueba (solo desarrollo)
const USUARIOS = [
  { nombre: "Admin DePaso", email: "admin@depaso.local", password: "Admin123!", rol: "admin" },
  { nombre: "Usuario Demo", email: "demo@depaso.local", password: "Demo1234!", rol: "usuario" },
];

// carga roles, proveedores y usuarios; se puede correr muchas veces
export async function sembrar(conn) {
  for (const nombre of ROLES) {
    await conn.query("INSERT IGNORE INTO roles (nombre) VALUES (?)", [nombre]);
  }
  for (const nombre of PROVEEDORES) {
    await conn.query("INSERT IGNORE INTO proveedores (nombre) VALUES (?)", [nombre]);
  }
  if (process.env.NODE_ENV === "production") return; // en producción no se crean usuarios de prueba
  for (const u of USUARIOS) {
    const hash = await bcrypt.hash(u.password, 10);
    await conn.query(
      `INSERT IGNORE INTO usuarios (nombre, email, password_hash, rol_id)
       VALUES (?, ?, ?, (SELECT id FROM roles WHERE nombre = ?))`,
      [u.nombre, u.email, hash, u.rol]
    );
  }
}
