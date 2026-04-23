
import { imageSources, titleColors } from './constants.js';
import { getDomElements } from './dom.js';
import { createDomState } from './state.js';
import { ensureImage, ensureTitle, requireImage, requireTitle, setFeedback } from './ui.js';

// aca engancho todos los eventos de la consigna
export function initDomProject() {
  const elements = getDomElements();
  const state = createDomState();

  document.addEventListener('DOMContentLoaded', () => {
    setFeedback(elements.feedback, 'Todavia no realizaste ninguna accion.');
  });

  // este mete el h1
  elements.addTitleButton.addEventListener('click', () => {
    const titleResult = ensureTitle(elements.stage);
    setFeedback(
      elements.feedback,
      titleResult.created
        ? 'Se agrego el H1 con el texto "Hola DOM".'
        : 'El H1 ya estaba disponible en el escenario.'
    );
  });

  // con doble click le cambio el texto
  elements.changeTextButton.addEventListener('dblclick', () => {
    const title = requireTitle();
    if (!title) {
      setFeedback(elements.feedback, 'Primero tenes que agregar el H1.');
      return;
    }

    title.textContent = 'Chau DOM';
    setFeedback(elements.feedback, 'El texto del H1 cambio a "Chau DOM".');
  });

  // cuando pasas por arriba cambia el color
  elements.changeColorButton.addEventListener('mouseenter', () => {
    const title = requireTitle();
    if (!title) {
      setFeedback(elements.feedback, 'Primero tenes que agregar el H1 para cambiar su color.');
      return;
    }

    title.style.color = titleColors[state.titleColorIndex];
    setFeedback(elements.feedback, `El color del H1 cambio a ${titleColors[state.titleColorIndex]}.`);
    state.titleColorIndex = (state.titleColorIndex + 1) % titleColors.length;
  });

  // este agrega la imagen
  elements.addImageButton.addEventListener('click', () => {
    const imageResult = ensureImage(elements.stage, imageSources[state.imageIndex], state.imageSize);
    setFeedback(
      elements.feedback,
      imageResult.created
        ? 'Se agrego una imagen del directorio media.'
        : 'La imagen ya estaba disponible en el escenario.'
    );
  });

  // click derecho para ir cambiando la imagen
  elements.changeImageButton.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const image = requireImage();
    if (!image) {
      setFeedback(elements.feedback, 'Primero tenes que agregar la imagen.');
      return;
    }

    state.imageIndex = (state.imageIndex + 1) % imageSources.length;
    image.src = imageSources[state.imageIndex];
    setFeedback(elements.feedback, 'La imagen cambio usando archivos de la carpeta media.');
  });

  // si lo mantengo apretado va cambiando el tamaño
  elements.resizeImageButton.addEventListener('mousedown', () => {
    const image = requireImage();
    if (!image) {
      setFeedback(elements.feedback, 'Primero tenes que agregar la imagen para cambiar su tamano.');
      return;
    }

    state.imageSize = state.imageSize >= 320 ? 160 : state.imageSize + 40;
    image.style.width = `${state.imageSize}px`;
    image.style.height = `${state.imageSize}px`;
    setFeedback(elements.feedback, `El tamano de la imagen cambio a ${state.imageSize}px.`);
  });
}
