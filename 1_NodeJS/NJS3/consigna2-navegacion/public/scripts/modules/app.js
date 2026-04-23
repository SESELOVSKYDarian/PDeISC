/**
 * @module app
 * @description Punto de entrada de la Consigna 2.
 * Inicializa la navegación entre componentes por distintos eventos DHTML.
 */

import { getNavigationElements } from './dom.js';
import { bindNavigationEvents } from './events.js';

/**
 * Inicializa el proyecto de navegación por eventos.
 */
export function initNavigationProject() {
  const elements = getNavigationElements();

  document.addEventListener('DOMContentLoaded', () => {
    elements.feedback.textContent = 'DOM cargado. Usa los distintos eventos para navegar.';
  });

  bindNavigationEvents(elements.buttons, elements.panels, elements.feedback);
}
