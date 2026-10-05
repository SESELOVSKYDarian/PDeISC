const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NOMBRE = /^\p{L}[\p{L} .'-]{1,79}$/u; // solo letras, sin números

export function validarEmail(email: string): string {
  const valor = email.trim();
  if (!valor) return "Ingresá tu email";
  if (valor.length > 120 || !EMAIL.test(valor)) return "El email no es válido";
  return "";
}

export function validarPassword(password: string): string {
  if (!password) return "Ingresá tu contraseña";
  if (password.length < 6) return "Mínimo 6 caracteres";
  if (password.length > 72) return "Máximo 72 caracteres";
  return "";
}

export function validarNombre(nombre: string): string {
  const valor = nombre.trim();
  if (!valor) return "Ingresá tu nombre";
  if (!NOMBRE.test(valor)) return "Solo letras (entre 2 y 80)";
  return "";
}

// contraseña nueva: 8+ con al menos una letra y un número
export function validarPasswordNueva(password: string): string {
  if (!password) return "Ingresá una contraseña";
  if (password.length < 8) return "Mínimo 8 caracteres";
  if (password.length > 72) return "Máximo 72 caracteres";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Necesita una letra y un número";
  return "";
}

export function validarConfirmacion(password: string, confirmar: string): string {
  if (!confirmar) return "Repetí la contraseña";
  if (password !== confirmar) return "Las contraseñas no coinciden";
  return "";
}
