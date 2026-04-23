/**
 * @module log
 * @description Registro dinámico de cambios de atributos para la Consigna 4.
 */

/**
 * Agrega un item al log de cambios. Elimina el mensaje inicial si aún está presente.
 * @param {HTMLElement} changesLog - Lista donde se registran los cambios.
 * @param {string} message - Texto del item a agregar.
 */
export function addLogItem(changesLog, message) {
  if (changesLog.children.length === 1 && changesLog.textContent.includes('Sin cambios')) {
    changesLog.innerHTML = '';
  }

  const item = document.createElement('li');
  item.className = 'list-group-item px-0';
  item.textContent = message;
  changesLog.appendChild(item);
}

/**
 * Reemplaza todo el contenido del log con un único mensaje inicial.
 * @param {HTMLElement} changesLog - Lista del log.
 * @param {string} message - Mensaje a mostrar.
 */
export function setInitialLog(changesLog, message) {
  changesLog.innerHTML = `<li class="list-group-item px-0">${message}</li>`;
}
