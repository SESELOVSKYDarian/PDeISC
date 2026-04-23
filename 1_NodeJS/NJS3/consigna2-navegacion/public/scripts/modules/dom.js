/**
 * @module dom
 * @description Selección de elementos del DOM para la Consigna 2.
 */

/**
 * Retorna los elementos de navegación y feedback.
 * @returns {{ buttons: NodeList, panels: NodeList, feedback: HTMLElement }}
 */
export function getNavigationElements() {
  return {
    buttons: document.querySelectorAll('.nav-btn'),
    panels: document.querySelectorAll('.panel'),
    feedback: document.getElementById('feedback')
  };
}
