import bcrypt from "bcrypt";

const ROUNDS = 12;

// hash falso: sirve para gastar el mismo tiempo cuando el email no existe
const fakeHash = bcrypt.hashSync("contraseña-falsa", ROUNDS);

export const hashPassword = (password) => bcrypt.hash(password, ROUNDS);

export async function checkPassword(password, hash) {
  const ok = await bcrypt.compare(password, hash || fakeHash);
  return Boolean(hash) && ok;
}
