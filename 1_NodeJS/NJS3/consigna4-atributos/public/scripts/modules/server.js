import { originalNodes, updatedNodes } from './constants.js';
import { getAttributeElements } from './dom.js';
import { renderSingleNode, updateNode } from './links.js';
import { addLogItem } from './log.js';

// aca dejo andando la parte de crear nodos y despues editarlos
export function initAttributesProject() {
  const elements = getAttributeElements();

  elements.createButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const nodeData = originalNodes[i];
      renderSingleNode(elements.nodesContainer, nodeData);
      elements.editButtons[i].disabled = false;
      btn.disabled = true;
      addLogItem(elements.changesLog, `Nodo creado: ${nodeData.label} <${nodeData.tag}>.`);
    });
  });

  elements.editButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const messages = updateNode(elements.nodesContainer, `node-${i + 1}`, updatedNodes);
      messages.forEach((msg) => addLogItem(elements.changesLog, msg));
      btn.disabled = true;
    });
  });
}
