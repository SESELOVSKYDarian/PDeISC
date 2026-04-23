import { getInnerHtmlElements } from './dom.js';
import { templates } from './templates.js';

// desde aca agrego o limpio lo que se mete con innerHTML
export function initInnerHtmlProject() {
  const elements = getInnerHtmlElements();

  // segun el boton mete un bloque distinto
  elements.insertButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.type;
      elements.output.innerHTML += templates[type];
      elements.feedback.textContent = `Se agrego un bloque de tipo ${type} con innerHTML.`;
    });
  });

  // con doble click limpio todo de una
  elements.clearButton.addEventListener('dblclick', () => {
    elements.output.innerHTML = '';
    elements.feedback.textContent = 'El contenido generado fue limpiado con dblclick.';
  });
}
