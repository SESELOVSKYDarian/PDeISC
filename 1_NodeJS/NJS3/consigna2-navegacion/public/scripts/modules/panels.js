// muestro el panel que corresponde y apago el resto
export function showPanel(panels, feedbackElement, panelId, eventName) {
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === panelId);
  });

  const activePanel = document.getElementById(panelId);
  feedbackElement.textContent = `Se mostro ${activePanel.querySelector('h2').textContent} con el evento ${eventName}.`;
}
