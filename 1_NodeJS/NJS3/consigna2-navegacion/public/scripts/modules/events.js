/**
 * @module events
 * @description Registro de eventos de navegación para la Consigna 2.
 * Soporta: click, dblclick, mouseenter, contextmenu y keydown (Enter).
 */

import { showPanel } from './panels.js';

/**
 * Vincula los eventos de cada botón de navegación según su atributo data-event.
 * @param {NodeList} buttons - Botones de navegación.
 * @param {NodeList} panels - Paneles del área de contenido.
 * @param {HTMLElement} feedbackElement - Elemento de estado visible.
 */
export function bindNavigationEvents(buttons, panels, feedbackElement) {
  buttons.forEach((button) => {
    const target = button.dataset.target;
    const eventName = button.dataset.event;

    if (eventName === 'click') {
      button.addEventListener('click', () => showPanel(panels, feedbackElement, target, eventName));
    }

    if (eventName === 'dblclick') {
      button.addEventListener('dblclick', () => showPanel(panels, feedbackElement, target, eventName));
    }

    if (eventName === 'mouseenter') {
      button.addEventListener('mouseenter', () => showPanel(panels, feedbackElement, target, eventName));
    }

    if (eventName === 'contextmenu') {
      button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showPanel(panels, feedbackElement, target, eventName);
      });
    }

    if (eventName === 'keydown') {
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') showPanel(panels, feedbackElement, target, eventName);
      });
    }
  });
}
