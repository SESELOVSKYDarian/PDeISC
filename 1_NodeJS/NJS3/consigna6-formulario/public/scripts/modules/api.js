/**
 * @module api
 * @description Cliente HTTP para la Consigna 6. Envía el registro al backend Express.
 */

/**
 * Envía el payload de registro al endpoint POST /registro.
 * @param {Object} payload - Datos del formulario serializados.
 * @returns {Promise<{ status: number, body: Object }>}
 */
export async function submitRegistration(payload) {
  const response = await fetch('/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return {
    status: response.status,
    body: await response.json()
  };
}
