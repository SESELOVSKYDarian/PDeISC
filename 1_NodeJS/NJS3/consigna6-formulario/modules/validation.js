/**
 * @module validation (backend)
 * @description Validación y sanitización del registro en el servidor Express.
 * Aplica las mismas reglas que el frontend para garantizar integridad de datos.
 */

/** @type {RegExp} Solo letras unicode y espacios. */
const NAME_REGEX = /^[\p{L}\s]+$/u;
/** @type {RegExp} Email válido con @ y dominio terminado en .com */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.com$/i;
const ALLOWED_PAISES = new Set(['Argentina', 'Chile', 'Uruguay', 'Mexico']);
const ALLOWED_GENEROS = new Set(['Femenino', 'Masculino', 'Otro']);
const ALLOWED_INTERESES = new Set(['DOM', 'Eventos', 'Express']);

/**
 * Normaliza un valor de texto.
 * @param {*} value
 * @returns {string}
 */
function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

/**
 * Normaliza y filtra el array de intereses.
 * @param {*} value
 * @returns {string[]}
 */
function normalizeIntereses(value) {
  const items = Array.isArray(value) ? value : value ? [value] : [];
  return items.map((item) => normalizeText(item)).filter((item) => ALLOWED_INTERESES.has(item));
}

/**
 * Sanitiza el body del request de registro.
 * @param {Object} body - Body del request Express.
 * @returns {{ nombre: string, apellido: string, email: string, edad: string, genero: string, pais: string, intereses: string[] }}
 */
export function sanitizeRegistration(body) {
  return {
    nombre: normalizeText(body.nombre),
    apellido: normalizeText(body.apellido),
    email: normalizeText(body.email).toLowerCase(),
    edad: normalizeText(body.edad),
    genero: normalizeText(body.genero),
    pais: normalizeText(body.pais),
    intereses: normalizeIntereses(body.intereses)
  };
}

/**
 * Valida los datos sanitizados del registro.
 * @param {ReturnType<typeof sanitizeRegistration>} data
 * @returns {{ isValid: boolean, errors: Object.<string, string> }}
 */
export function validateRegistration(data) {
  const errors = {};
  const edad = Number(data.edad);

  if (data.nombre.length < 3 || data.nombre.length > 100 || !NAME_REGEX.test(data.nombre)) {
    errors.nombre = 'El nombre debe tener entre 3 y 100 letras y no puede incluir numeros.';
  }

  if (data.apellido.length < 2 || data.apellido.length > 100 || !NAME_REGEX.test(data.apellido)) {
    errors.apellido = 'El apellido debe tener entre 2 y 100 letras y no puede incluir numeros.';
  }

  if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'El email debe ser valido, incluir @ y terminar en .com.';
  }

  if (!Number.isInteger(edad) || edad < 1 || edad > 120) {
    errors.edad = 'La edad debe ser un numero entero entre 1 y 120.';
  }

  if (!ALLOWED_GENEROS.has(data.genero)) {
    errors.genero = 'Debes seleccionar un genero valido.';
  }

  if (!ALLOWED_PAISES.has(data.pais)) {
    errors.pais = 'Debes seleccionar un pais valido.';
  }

  if (data.intereses.length === 0) {
    errors.intereses = 'Debes seleccionar al menos un interes.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
