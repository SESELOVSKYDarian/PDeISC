/**
 * @module modal
 * @description Controlador del modal Bootstrap para mostrar información al usuario.
 * Reemplaza el uso de alert() con un modal accesible y estilizado.
 */

/**
 * Crea un controlador para el modal con el id indicado.
 * @param {string} modalId - ID del elemento modal en el DOM.
 * @returns {{ show: function({ title: string, body: string }): void }}
 */
export function createModalController(modalId) {
  const element = document.getElementById(modalId);
  const titleElement = element.querySelector('[data-modal-title]');
  const bodyElement = element.querySelector('[data-modal-body]');
  const modalInstance = new bootstrap.Modal(element);

  /**
   * Muestra el modal con el título y cuerpo indicados.
   * @param {{ title: string, body: string }} options
   */
  function show({ title, body }) {
    titleElement.textContent = title;
    bodyElement.innerHTML = body;
    modalInstance.show();
  }

  return { show };
}
