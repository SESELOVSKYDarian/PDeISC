// esto me deja reutilizar el modal sin repetir logica
export function createModalController(modalId) {
  const element = document.getElementById(modalId);
  const titleElement = element.querySelector('[data-modal-title]');
  const bodyElement = element.querySelector('[data-modal-body]');
  const modalInstance = new bootstrap.Modal(element);

  // le cambio el contenido y lo abro
  function show({ title, body }) {
    titleElement.textContent = title;
    bodyElement.innerHTML = body;
    modalInstance.show();
  }

  return { show };
}
