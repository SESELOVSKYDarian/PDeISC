/**
 * @module dom
 * @description Selección de elementos del DOM para la Consigna 3.
 */

/**
 * Retorna los elementos del proyecto de conteo de hijos.
 * @returns {{ countButton: HTMLButtonElement, container: HTMLElement, result: HTMLElement, extraInfo: HTMLElement }}
 */
export function getChildrenElements() {
  return {
    countButton: document.getElementById('count-btn'),
    container: document.getElementById('container'),
    result: document.getElementById('result'),
    extraInfo: document.getElementById('extra-info')
  };
}
