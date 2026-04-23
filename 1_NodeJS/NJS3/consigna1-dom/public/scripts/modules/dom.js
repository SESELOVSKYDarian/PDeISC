/**
 * @module dom
 * @description Selección y acceso a los elementos del DOM para la Consigna 1.
 */

/**
 * Retorna los elementos principales de la interfaz.
 * @returns {{ stage: HTMLElement, feedback: HTMLElement, addTitleButton: HTMLButtonElement, changeTextButton: HTMLButtonElement, changeColorButton: HTMLButtonElement, addImageButton: HTMLButtonElement, changeImageButton: HTMLButtonElement, resizeImageButton: HTMLButtonElement }}
 */
export function getDomElements() {
  return {
    stage: document.getElementById('stage'),
    feedback: document.getElementById('feedback'),
    addTitleButton: document.getElementById('add-title-btn'),
    changeTextButton: document.getElementById('change-text-btn'),
    changeColorButton: document.getElementById('change-color-btn'),
    addImageButton: document.getElementById('add-image-btn'),
    changeImageButton: document.getElementById('change-image-btn'),
    resizeImageButton: document.getElementById('resize-image-btn')
  };
}

/**
 * Retorna el H1 dinámico si existe en el DOM.
 * @returns {HTMLHeadingElement|null}
 */
export function getDynamicTitle() {
  return document.getElementById('dynamic-title');
}

/**
 * Retorna la imagen dinámica si existe en el DOM.
 * @returns {HTMLImageElement|null}
 */
export function getDynamicImage() {
  return document.getElementById('dynamic-image');
}
