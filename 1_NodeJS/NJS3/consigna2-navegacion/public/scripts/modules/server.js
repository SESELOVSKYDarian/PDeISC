import { getNavigationElements } from './dom.js';
import { bindNavigationEvents } from './events.js';

// desde aca arranca toda la logica de navegacion
export function initNavigationProject() {
  const elements = getNavigationElements();

  document.addEventListener('DOMContentLoaded', () => {
    elements.feedback.textContent = 'DOM cargado. Usa los distintos eventos para navegar.';
  });

  bindNavigationEvents(elements.buttons, elements.panels, elements.feedback);
}
