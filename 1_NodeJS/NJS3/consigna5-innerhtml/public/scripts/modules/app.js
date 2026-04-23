/**
 * @module app
 * @description Punto de entrada de la Consigna 5.
 * Inserta distintos bloques HTML usando innerHTML mediante eventos click y dblclick.
 */

import { getInnerHtmlElements } from './dom.js';
import { templates } from './templates.js';

/**
 * Inicializa el proyecto innerHTML.
 */
export function initInnerHtmlProject() {
  const elements = getInnerHtmlElements();

  // click → inserta el bloque HTML correspondiente al tipo del botón
  elements.insertButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.type;
      elements.output.innerHTML += templates[type];
      elements.feedback.textContent = `Se agrego un bloque de tipo ${type} con innerHTML.`;
    });
  });

  // dblclick → limpia todo el contenido del área de renderizado
  elements.clearButton.addEventListener('dblclick', () => {
    elements.output.innerHTML = '';
    elements.feedback.textContent = 'El contenido generado fue limpiado con dblclick.';
  });
}
