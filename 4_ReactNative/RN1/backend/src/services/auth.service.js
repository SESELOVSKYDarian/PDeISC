import bcrypt from "bcrypt";
import { buscarPorEmail, crearUsuario, publico } from "./users.service.js";

// hash válido pero inútil: gasta el mismo tiempo cuando el usuario no existe
const HASH_FALSO = bcrypt.hashSync("no-existe", 10);

// devuelve el usuario público o null si las credenciales no sirven
export async function iniciarSesion(email, password) {
  const usuario = await buscarPorEmail(email);
  const coincide = await bcrypt.compare(password, usuario?.password_hash ?? HASH_FALSO);
  if (!usuario || !usuario.password_hash || !coincide) return null;
  return publico(usuario);
}

// crea la cuenta; devuelve el usuario público o null si el email ya existe
export async function registrar({ nombre, email, password }) {
  if (await buscarPorEmail(email)) return null;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await crearUsuario({ nombre, email, passwordHash });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return null; // se coló otro registro igual
    throw error;
  }
  return publico(await buscarPorEmail(email));
}
