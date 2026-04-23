/**
 * @module ui
 * @description Funciones de UI para la Consigna 6.
 * Maneja validaciones visuales, renderizado del resultado dinámico y construcción de markup.
 */

/**
 * Elimina todos los estados de error del formulario.
 * @param {HTMLFormElement} form
 */
export function clearErrors(form) {
  form.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
  form.querySelectorAll('[data-error-for]').forEach((node) => { node.textContent = ''; });
}

/**
 * Marca un campo como inválido y muestra su mensaje de error.
 * @param {HTMLFormElement} form
 * @param {string} name - Nombre del campo (atributo name).
 * @param {string} message - Mensaje de error a mostrar.
 */
export function markInvalid(form, name, message) {
  form.querySelectorAll(`[name="${name}"]`).forEach((field) => field.classList.add('is-invalid'));
  const errorTarget = form.querySelector(`[data-error-for="${name}"]`);
  if (errorTarget) errorTarget.textContent = message;
}

/**
 * Limpia el error visual de un campo específico.
 * @param {HTMLFormElement} form
 * @param {string} name - Nombre del campo.
 */
export function clearFieldError(form, name) {
  form.querySelectorAll(`[name="${name}"]`).forEach((field) => field.classList.remove('is-invalid'));
  const errorTarget = form.querySelector(`[data-error-for="${name}"]`);
  if (errorTarget) errorTarget.textContent = '';
}

/**
 * Renderiza el resultado dinámico en la sección de resultados.
 * @param {HTMLElement} result - Contenedor del resultado.
 * @param {string} title - Título de la sección.
 * @param {string} body - HTML del cuerpo.
 * @param {string} alertClass - Clase Bootstrap del alert (alert-success, alert-danger, etc).
 */
export function renderResult(result, title, body, alertClass) {
  result.innerHTML = `
    <div class="card-body">
      <h2 class="h4 mb-3" style="font-family:'Montserrat',sans-serif;font-weight:700">${title}</h2>
      <div class="alert ${alertClass} mb-0">${body}</div>
    </div>
  `;
}

/**
 * Construye el HTML del resultado exitoso con los datos registrados.
 * Incluye una tarjeta visual con avatar e información del usuario.
 * @param {Object} data - Datos del usuario registrado.
 * @param {string} message - Mensaje de confirmación del backend.
 * @param {string} emailStatus - Estado del envío de email.
 * @returns {string} HTML del resultado.
 */
export function buildSuccessMarkup(data, message, emailStatus) {
  const initials = `${data.nombre[0]}${data.apellido[0]}`.toUpperCase();
  const chips = data.intereses.map((i) => `<span class="result-chip">${i}</span>`).join(' ');

  return `
    <div class="result-profile">
      <div class="result-avatar">${initials}</div>
      <div>
        <div class="result-field">
          <span class="result-field-label">Nombre</span>
          <span class="result-field-value">${data.nombre} ${data.apellido}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Email</span>
          <span class="result-field-value">${data.email}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Edad</span>
          <span class="result-field-value">${data.edad} años</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Género</span>
          <span class="result-field-value">${data.genero}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">País</span>
          <span class="result-field-value">${data.pais}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Intereses</span>
          <span>${chips}</span>
        </div>
        <div class="result-field mt-2">
          <span class="result-field-label">Backend</span>
          <span class="result-field-value" style="font-size:0.8rem;color:var(--c-muted)">${message}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">SMTP</span>
          <span class="result-field-value" style="font-size:0.8rem;color:var(--c-muted)">${emailStatus}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Construye el HTML del resultado fallido con los errores de validación.
 * @param {string} message - Mensaje de error principal.
 * @param {Object.<string, string>} [errors] - Mapa de campo → mensaje de error.
 * @returns {string} HTML del resultado.
 */
export function buildFailureMarkup(message, errors) {
  const items = Object.values(errors ?? {}).map((error) => `<li>${error}</li>`).join('');
  return `
    <p><strong>No se pudo completar el registro.</strong></p>
    <p>${message}</p>
    <ul class="mb-0">${items}</ul>
  `;
}
