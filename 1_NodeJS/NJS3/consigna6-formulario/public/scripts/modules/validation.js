/**
 * @module validation
 * @description Validación frontend del formulario de registro para la Consigna 6.
 * Aplica reglas de longitud, formato y contenido para cada campo.
 */

import { EMAIL_REGEX, NAME_REGEX } from './constants.js';

/**
 * Valida el payload del formulario.
 * @param {{ nombre: string, apellido: string, email: string, edad: string, genero: string, pais: string, intereses: string[] }} payload
 * @returns {Object.<string, string>} Mapa de campo → mensaje de error. Vacío si no hay errores.
 */
export function validatePayload(payload) {
  const errors = {};
  const edad = Number(payload.edad);

  if (payload.nombre.length < 3 || payload.nombre.length > 100 || !NAME_REGEX.test(payload.nombre)) {
    errors.nombre = 'El nombre debe tener entre 3 y 100 letras y no puede incluir numeros.';
  }

  if (payload.apellido.length < 2 || payload.apellido.length > 100 || !NAME_REGEX.test(payload.apellido)) {
    errors.apellido = 'El apellido debe tener entre 2 y 100 letras y no puede incluir numeros.';
  }

  if (!EMAIL_REGEX.test(payload.email)) {
    errors.email = 'El email debe incluir @ y terminar en .com.';
  }

  if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
    errors.edad = 'La edad debe ser un numero entero entre 1 y 120.';
  }

  if (!payload.genero) {
    errors.genero = 'Debes seleccionar un genero.';
  }

  if (!payload.pais) {
    errors.pais = 'Debes seleccionar un pais.';
  }

  if (payload.intereses.length === 0) {
    errors.intereses = 'Debes seleccionar al menos un interes.';
  }

  return errors;
}
