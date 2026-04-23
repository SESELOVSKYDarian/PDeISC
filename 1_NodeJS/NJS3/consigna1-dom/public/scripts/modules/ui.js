import { getDynamicImage, getDynamicTitle } from './dom.js';

// con esto cambio el mensaje de abajo
export function setFeedback(feedbackElement, message) {
  feedbackElement.textContent = message;
}

// si no esta el h1 lo creo aca
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

// si no esta la imagen la agrego aca
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

// devuelve el h1 o null
export function requireTitle() {
  return getDynamicTitle();
}

// devuelve la imagen o null
export function requireImage() {
  return getDynamicImage();
}
