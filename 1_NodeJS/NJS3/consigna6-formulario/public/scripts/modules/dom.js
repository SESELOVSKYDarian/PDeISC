/**
 * @module dom
 * @description Selección de elementos del DOM para la Consigna 6.
 */

/**
 * Retorna los elementos principales del formulario.
 * @returns {{ form: HTMLFormElement, result: HTMLElement, eventsLog: HTMLElement }}
 */
export function getFormElements() {
  return {
    form: document.getElementById('register-form'),
    result: document.getElementById('result'),
    eventsLog: document.getElementById('events-log')
  };
}
