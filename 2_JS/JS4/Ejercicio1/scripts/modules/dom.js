export function getViewElements(prefix) {
  return {
    button: document.querySelector(`#${prefix}-button`),
    status: document.querySelector(`#${prefix}-status`),
    container: document.querySelector(`#${prefix}-users`)
  };
}

export function showStatus(element, message, type) {
  element.className = `status-box status-box--${type}`;
  element.textContent = message;
}

export function clearContainer(container) {
  container.innerHTML = "";
}
