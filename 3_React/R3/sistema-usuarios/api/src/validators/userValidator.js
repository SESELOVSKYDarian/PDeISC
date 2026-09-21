import { validateEmail } from "./emailValidator.js";
import { validateName } from "./nameValidator.js";
import { validatePassword } from "./passwordValidator.js";

export const roles = ["usuario", "administrador"];

export const isValidRole = (rol) => roles.includes(rol);

// devuelve un objeto { campo: mensaje }; vacío si todo está bien
export function validateUser({ nombre, email, password }, passwordRequired = true) {
  const errors = {};

  const nameError = validateName(nombre);
  if (nameError) errors.nombre = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const mustCheckPassword = passwordRequired || (password !== undefined && password !== "");
  if (mustCheckPassword) {
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
  }

  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
