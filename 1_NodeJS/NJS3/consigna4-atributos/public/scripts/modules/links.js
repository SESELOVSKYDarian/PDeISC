/**
 * @module links
 * @description Creacion y modificacion de nodos para la Consigna 4.
 */

function createPreviewNode(nodeData) {
  const nodeElement = document.createElement(nodeData.tag);
  nodeElement.className = 'dynamic-node';
  nodeElement.dataset.nodeId = nodeData.id;

  if (nodeData.tag === 'input') {
    nodeElement.value = nodeData.attributes?.value ?? '';
  } else if (nodeData.text) {
    nodeElement.textContent = nodeData.text;
  }

  Object.entries(nodeData.attributes ?? {}).forEach(([name, value]) => {
    if (nodeData.tag === 'input' && (name === 'value' || name === 'placeholder')) {
      nodeElement[name] = value;
    }
    nodeElement.setAttribute(name, value);
  });

  return nodeElement;
}

function createNodeCard(nodeData) {
  const card = document.createElement('article');
  card.className = 'node-card';
  card.dataset.nodeId = nodeData.id;

  const header = document.createElement('div');
  header.className = 'node-card-header';
  header.innerHTML = `<span>${nodeData.label}</span><code>${nodeData.tag}</code>`;

  const preview = document.createElement('div');
  preview.className = 'node-preview';
  preview.appendChild(createPreviewNode(nodeData));

  card.append(header, preview);
  return card;
}

/**
 * Inserta un único nodo en el contenedor. Si ya existe, no lo duplica.
 * @param {HTMLElement} container
 * @param {Object} nodeData
 */
export function renderSingleNode(container, nodeData) {
  if (container.querySelector(`[data-node-id="${nodeData.id}"]`)) return;
  container.appendChild(createNodeCard(nodeData));
}

/**
 * Actualiza un nodo puntual y devuelve el detalle de cambios realizados.
 * @param {HTMLElement} container
 * @param {string} nodeId
 * @param {Record<string, any>} updatedNodes
 * @returns {string[]}
 */
export function updateNode(container, nodeId, updatedNodes) {
  const card = container.querySelector(`.node-card[data-node-id="${nodeId}"]`);
  const nodeElement = card?.querySelector('.dynamic-node');
  const nextData = updatedNodes[nodeId];

  if (!card || !nodeElement || !nextData) {
    return ['Primero debes crear los 5 nodos antes de modificar atributos.'];
  }

  const changes = [];

  if (nextData.text !== undefined) {
    if (nodeElement.tagName === 'INPUT') {
      const previousValue = nodeElement.value;
      nodeElement.value = nextData.text;
      nodeElement.setAttribute('value', nextData.text);
      changes.push(`${nodeId}: value cambio de "${previousValue}" a "${nextData.text}".`);
    } else {
      const previousText = nodeElement.textContent;
      nodeElement.textContent = nextData.text;
      changes.push(`${nodeId}: texto cambio de "${previousText}" a "${nextData.text}".`);
    }
  }

  Object.entries(nextData.attributes ?? {}).forEach(([name, value]) => {
    const previousValue =
      nodeElement.tagName === 'INPUT' && (name === 'value' || name === 'placeholder')
        ? nodeElement[name]
        : nodeElement.getAttribute(name);

    if (nodeElement.tagName === 'INPUT' && (name === 'value' || name === 'placeholder')) {
      nodeElement[name] = value;
    }

    nodeElement.setAttribute(name, value);
    changes.push(`${nodeId}: ${name} cambio de "${previousValue ?? ''}" a "${value}".`);
  });

  return changes;
}
