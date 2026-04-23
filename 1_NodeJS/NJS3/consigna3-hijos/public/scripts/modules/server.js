import { getChildrenElements } from './dom.js';

// esto deja listo el punto donde cuento los hijos del contenedor
export function initChildrenProject() {
  const elements = getChildrenElements();

  document.addEventListener('DOMContentLoaded', () => {
    elements.result.textContent = 'Presiona el boton para contar los hijos del contenedor.';
    elements.extraInfo.textContent = 'Base tomada del punto 2: 5 componentes dentro de un mismo contenedor.';
  });

  // aca cuento los hijos directos nada mas
  elements.countButton.addEventListener('click', () => {
    const totalChildren = elements.container.children.length;
    elements.result.textContent = `El contenedor tiene ${totalChildren} hijos.`;
  });
}
