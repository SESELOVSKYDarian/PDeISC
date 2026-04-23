/**
 * @module form-data
 * @description Extracción y normalización de datos del formulario para la Consigna 6.
 */

/**
 * Normaliza un valor de texto: elimina espacios sobrantes y colapsa espacios múltiples.
 * @param {*} value - Valor a normalizar.
 * @returns {string}
 */
export function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

/**
 * Extrae y normaliza todos los campos del formulario usando FormData.
 * @param {HTMLFormElement} form - Formulario de registro.
 * @returns {{ nombre: string, apellido: string, email: string, edad: string, genero: string, pais: string, intereses: string[] }}
 */
export function getPayload(form) {
  const data = new FormData(form);

  return {
    nombre: normalizeText(data.get('nombre')),
    apellido: normalizeText(data.get('apellido')),
    email: normalizeText(data.get('email')).toLowerCase(),
    edad: normalizeText(data.get('edad')),
    genero: normalizeText(data.get('genero')),
    pais: normalizeText(data.get('pais')),
    intereses: data.getAll('intereses').map((value) => normalizeText(value))
  };
}
