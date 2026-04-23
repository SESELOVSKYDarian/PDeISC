/**
 * @module ui
 * @description Funciones de manipulacion de UI para la Consigna 1.
 * Gestiona la creacion y actualizacion del H1, la imagen dinamica y el mensaje de feedback.
 */

import { getDynamicImage, getDynamicTitle } from './dom.js';

/**
 * Actualiza el texto del elemento de feedback.
 * @param {HTMLElement} feedbackElement - Elemento que muestra el mensaje.
 * @param {string} message - Mensaje a mostrar.
 */
export function setFeedback(feedbackElement, message) {
  feedbackElement.textContent = message;
}

/**
 * Agrega el H1 al escenario si no existe.
 * @param {HTMLElement} stage - Contenedor del escenario.
 * @returns {{ element: HTMLHeadingElement, created: boolean }}
 */
export function ensureTitle(stage) {
  const title = getDynamicTitle();

  if (title) {
    return { element: title, created: false };
  }

  const titleElement = document.createElement('h1');
  titleElement.id = 'dynamic-title';
  titleElement.className = 'dynamic-title';
  titleElement.textContent = 'Hola DOM';
  stage.prepend(titleElement);
  return { element: titleElement, created: true };
}

/**
 * Agrega la imagen al escenario si no existe.
 * @param {HTMLElement} stage - Contenedor del escenario.
 * @param {string} source - URL de la imagen.
 * @param {number} size - Tamano en pixeles.
 * @returns {{ element: HTMLImageElement, created: boolean }}
 */
export function ensureImage(stage, source, size) {
  const image = getDynamicImage();

  if (image) {
    return { element: image, created: false };
  }

  const imageElement = document.createElement('img');
  imageElement.id = 'dynamic-image';
  imageElement.className = 'dynamic-image';
  imageElement.src = source;
  imageElement.alt = 'Imagen dinamica agregada por DOM';
  imageElement.width = size;
  imageElement.height = size;
  stage.append(imageElement);
  return { element: imageElement, created: true };
}

/**
 * Requiere que el H1 exista; si no, retorna null.
 * @returns {HTMLHeadingElement|null}
 */
export function requireTitle() {
  return getDynamicTitle();
}

/**
 * Requiere que la imagen exista; si no, retorna null.
 * @returns {HTMLImageElement|null}
 */
export function requireImage() {
  return getDynamicImage();
}
