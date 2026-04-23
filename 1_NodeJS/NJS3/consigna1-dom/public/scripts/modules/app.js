
import { imageSources, titleColors } from './constants.js';
import { getDomElements } from './dom.js';
import { createDomState } from './state.js';
import { ensureImage, ensureTitle, requireImage, requireTitle, setFeedback } from './ui.js';

/**
 * Inicializa el proyecto DOM con todos sus event listeners.
 */
export function initDomProject() {
  const elements = getDomElements();
  const state = createDomState();

  document.addEventListener('DOMContentLoaded', () => {
    setFeedback(elements.feedback, 'Todavia no realizaste ninguna accion.');
  });

  // click -> agrega H1
  elements.addTitleButton.addEventListener('click', () => {
    const titleResult = ensureTitle(elements.stage);
    setFeedback(
      elements.feedback,
      titleResult.created
        ? 'Se agrego el H1 con el texto "Hola DOM".'
        : 'El H1 ya estaba disponible en el escenario.'
    );
  });

  // dblclick -> cambia texto del H1
  elements.changeTextButton.addEventListener('dblclick', () => {
    const title = requireTitle();
    if (!title) {
      setFeedback(elements.feedback, 'Primero tenes que agregar el H1.');
      return;
    }

    title.textContent = 'Chau DOM';
    setFeedback(elements.feedback, 'El texto del H1 cambio a "Chau DOM".');
  });

  // mouseenter -> cambia color del H1
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

  // click -> agrega imagen
  elements.addImageButton.addEventListener('click', () => {
    const imageResult = ensureImage(elements.stage, imageSources[state.imageIndex], state.imageSize);
    setFeedback(
      elements.feedback,
      imageResult.created
        ? 'Se agrego una imagen del directorio media.'
        : 'La imagen ya estaba disponible en el escenario.'
    );
  });

  // contextmenu -> cambia imagen
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

  // mousedown -> cambia tamano de imagen
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
