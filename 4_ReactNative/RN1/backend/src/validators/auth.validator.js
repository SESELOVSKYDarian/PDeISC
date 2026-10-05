const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOMBRE = /^\p{L}[\p{L} .'-]{1,79}$/u; // solo letras, sin números

const texto = (valor) => (typeof valor === "string" ? valor : "");

function errorEmail(email) {
  if (!email) return "Ingresá tu email";
  if (email.length > 120 || !EMAIL.test(email)) return "El email no es válido";
  return "";
}

// valida el body del login; devuelve { errores, datos }
export function validarLogin(body) {
  const errores = {};
  const email = texto(body?.email).trim();
  const password = texto(body?.password);

  const eEmail = errorEmail(email);
  if (eEmail) errores.email = eEmail;

  if (!password) errores.password = "Ingresá tu contraseña";
  else if (password.length < 6 || password.length > 72) errores.password = "La contraseña debe tener entre 6 y 72 caracteres";

  return { errores, datos: { email: email.toLowerCase(), password } };
}

// valida el body del registro; la contraseña pide 8+ con letra y número
export function validarRegistro(body) {
  const errores = {};
  const nombre = texto(body?.nombre).trim().replace(/\s+/g, " ");
  const email = texto(body?.email).trim();
  const password = texto(body?.password);

  if (!nombre) errores.nombre = "Ingresá tu nombre";
  else if (!NOMBRE.test(nombre)) errores.nombre = "El nombre solo puede tener letras (2 a 80)";

  const eEmail = errorEmail(email);
  if (eEmail) errores.email = eEmail;

  if (!password) errores.password = "Ingresá una contraseña";
  else if (password.length < 8 || password.length > 72) errores.password = "Debe tener entre 8 y 72 caracteres";
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) errores.password = "Debe tener al menos una letra y un número";

  return { errores, datos: { nombre, email: email.toLowerCase(), password } };
}
