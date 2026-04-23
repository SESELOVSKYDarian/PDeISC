/**
 * @module app
 * @description Punto de entrada de la Consigna 3.
 * Toma como base el punto anterior y permite contar cuantos hijos
 * tiene un contenedor mediante un evento de pulsado.
 */

import { getChildrenElements } from './dom.js';

/**
 * Inicializa el proyecto de conteo de hijos.
 */
export function initChildrenProject() {
  const elements = getChildrenElements();

  document.addEventListener('DOMContentLoaded', () => {
    elements.result.textContent = 'Presiona el boton para contar los hijos del contenedor.';
    elements.extraInfo.textContent = 'Base tomada del punto 2: 5 componentes dentro de un mismo contenedor.';
  });

  // click -> cuenta hijos directos del contenedor
  elements.countButton.addEventListener('click', () => {
    const totalChildren = elements.container.children.length;
    elements.result.textContent = `El contenedor tiene ${totalChildren} hijos.`;
  });
}
