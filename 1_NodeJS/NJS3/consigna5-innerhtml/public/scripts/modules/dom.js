/**
 * @module dom
 * @description Selección de elementos del DOM para la Consigna 5.
 */

/**
 * Retorna los elementos del proyecto innerHTML.
 * @returns {{ output: HTMLElement, feedback: HTMLElement, insertButtons: NodeList, clearButton: HTMLButtonElement }}
 */
export function getInnerHtmlElements() {
  return {
    output: document.getElementById('output'),
    feedback: document.getElementById('feedback'),
    insertButtons: document.querySelectorAll('.insert-btn'),
    clearButton: document.getElementById('clear-btn')
  };
}
