/**
 * @module panels
 * @description Lógica de activación de paneles para la Consigna 2.
 */

/**
 * Activa el panel con el id indicado y oculta los demás. Actualiza el feedback.
 * @param {NodeList} panels - Todos los paneles del DOM.
 * @param {HTMLElement} feedbackElement - Elemento de estado.
 * @param {string} panelId - ID del panel a mostrar.
 * @param {string} eventName - Nombre del evento que disparó la acción.
 */
export function showPanel(panels, feedbackElement, panelId, eventName) {
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === panelId);
  });

  const activePanel = document.getElementById(panelId);
  feedbackElement.textContent = `Se mostro ${activePanel.querySelector('h2').textContent} con el evento ${eventName}.`;
}
