/**
 * @module app
 * @description Punto de entrada de la Consigna 6.
 * Inicializa el formulario de registro con validación frontend y backend,
 * log de eventos DHTML y visualización dinámica del resultado.
 */

import { createModalController } from '../components/modal.js';
import { submitRegistration } from './api.js';
import { getFormElements } from './dom.js';
import { getPayload } from './form-data.js';
import { pushLog } from './log.js';
import {
  clearErrors,
  clearFieldError,
  markInvalid,
  renderResult,
  buildFailureMarkup,
  buildSuccessMarkup
} from './ui.js';
import { validatePayload } from './validation.js';

/**
 * Inicializa el proyecto del formulario de registro.
 */
export function initFormProject() {
  const elements = getFormElements();
  const modal = createModalController('feedback-modal');

  /** Muestra un modal con título y cuerpo HTML. */
  function showModal(title, body) {
    modal.show({ title, body });
  }

  // DOMContentLoaded → primer log
  document.addEventListener('DOMContentLoaded', () => {
    pushLog(elements.eventsLog, 'DOMContentLoaded: el formulario esta listo.');
  });

  // focus → registra qué campo recibió el foco
  elements.form.addEventListener('focus', (event) => {
    if (event.target.matches('input, select')) {
      pushLog(elements.eventsLog, `focus: ${event.target.name} recibio el foco.`);
    }
  }, true);

  // blur → registra qué campo perdió el foco
  elements.form.addEventListener('blur', (event) => {
    if (event.target.matches('input, select')) {
      pushLog(elements.eventsLog, `blur: ${event.target.name} perdio el foco.`);
    }
  }, true);

  // input → limpia error mientras el usuario escribe
  elements.form.addEventListener('input', (event) => {
    if (event.target.matches('input[type="text"], input[type="email"], input[type="number"]')) {
      pushLog(elements.eventsLog, `input: ${event.target.name} se esta modificando.`);
      clearFieldError(elements.form, event.target.name);
    }
  });

  // change → registra cambios en selects, radios y checkboxes
  elements.form.addEventListener('change', (event) => {
    if (event.target.matches('select, input[type="radio"], input[type="checkbox"]')) {
      pushLog(elements.eventsLog, `change: ${event.target.name} cambio su valor.`);
      clearFieldError(elements.form, event.target.name);
    }
  });

  // submit → valida en frontend, luego envía al backend
  elements.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors(elements.form);

    const payload = getPayload(elements.form);
    const errors = validatePayload(payload);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([name, message]) => markInvalid(elements.form, name, message));
      const failureMarkup = buildFailureMarkup('Revisa las validaciones antes de enviar.', errors);
      renderResult(elements.result, 'Resultado dinamico', failureMarkup, 'alert-danger');
      showModal('Validacion frontend', failureMarkup);
      pushLog(elements.eventsLog, 'submit: se bloquearon campos por validacion frontend.');
      return;
    }

    try {
      const response = await submitRegistration(payload);
      const data = response.body;

      if (response.status >= 400 || !data.ok) {
        Object.entries(data.errors ?? {}).forEach(([name, message]) => markInvalid(elements.form, name, message));
        const failureMarkup = buildFailureMarkup(data.message, data.errors);
        renderResult(elements.result, 'Resultado dinamico', failureMarkup, 'alert-danger');
        showModal('Respuesta del servidor', failureMarkup);
        pushLog(elements.eventsLog, 'submit: el backend devolvio errores de validacion o SMTP.');
        return;
      }

      const successMarkup = buildSuccessMarkup(data.data, data.message, data.emailStatus);
      renderResult(elements.result, 'Registro exitoso ✓', successMarkup, 'alert-success');
      showModal('Registro exitoso', successMarkup);
      pushLog(elements.eventsLog, 'submit: los datos se validaron y se envio la notificacion.');

    } catch {
      const failureMarkup = buildFailureMarkup('No hubo respuesta valida del servidor.', {
        servidor: 'Verifica que Express este en ejecucion.'
      });
      renderResult(elements.result, 'Resultado dinamico', failureMarkup, 'alert-danger');
      showModal('Error de comunicacion', failureMarkup);
      pushLog(elements.eventsLog, 'error: fallo la comunicacion con el servidor.');
    }
  });

  // reset → limpia errores y notifica
  elements.form.addEventListener('reset', () => {
    clearErrors(elements.form);
    setTimeout(() => {
      renderResult(elements.result, 'Resultado dinamico', '<p class="mb-0">El formulario fue reseteado.</p>', 'alert-secondary');
    }, 0);
    showModal('Formulario reiniciado', '<p class="mb-0">El formulario volvio a su estado inicial.</p>');
    pushLog(elements.eventsLog, 'reset: el formulario volvio a su estado inicial.');
  });
}
