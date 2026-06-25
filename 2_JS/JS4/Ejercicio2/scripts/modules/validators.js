import { getFields, paintField } from "./dom.js";
import { normalizeEmail, normalizeName } from "./normalizers.js";

export function getNameError(value) {
  const trimmedValue = normalizeName(value);

  if (!trimmedValue) {
    return "El nombre es obligatorio.";
  }

  if (trimmedValue.length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }

  if (trimmedValue.length > 40) {
    return "El nombre no puede superar los 40 caracteres.";
  }

  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(trimmedValue)) {
    return "El nombre solo puede tener letras y espacios.";
  }

  return "";
}

export function getEmailError(value) {
  const trimmedValue = normalizeEmail(value);

  if (!trimmedValue) {
    return "El email es obligatorio.";
  }

  if (trimmedValue.length < 6) {
    return "El email debe tener al menos 6 caracteres.";
  }

  if (trimmedValue.length > 80) {
    return "El email no puede superar los 80 caracteres.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return "Ingresa un email valido.";
  }

  return "";
}

export function getPayload(prefix) {
  const fields = getFields(prefix);

  return {
    name: normalizeName(fields.name.value),
    email: normalizeEmail(fields.email.value)
  };
}

export function validateFields(prefix) {
  // valido lo que escribio antes de seguir
  const fields = getFields(prefix);
  const payload = getPayload(prefix);
  const nameError = getNameError(payload.name);
  const emailError = getEmailError(payload.email);

  paintField(fields.name, fields.nameError, nameError);
  paintField(fields.email, fields.emailError, emailError);

  return {
    isValid: !nameError && !emailError,
    payload
  };
}
