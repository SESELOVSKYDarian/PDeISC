/**
 * @module log
 * @description Log de eventos del formulario para la Consigna 6.
 * Muestra los últimos 8 eventos en orden descendente.
 */

/**
 * Agrega un item al log de eventos, eliminando el mensaje inicial si corresponde.
 * Limita el log a un máximo de 8 entradas.
 * @param {HTMLElement} eventsLog - Lista donde se registran los eventos.
 * @param {string} message - Descripción del evento ocurrido.
 */
export function pushLog(eventsLog, message) {
  if (eventsLog.children.length === 1 && eventsLog.textContent.includes('Esperando')) {
    eventsLog.innerHTML = '';
  }

  const item = document.createElement('li');
  item.className = 'list-group-item px-0';
  item.textContent = message;
  eventsLog.prepend(item);

  while (eventsLog.children.length > 8) {
    eventsLog.removeChild(eventsLog.lastElementChild);
  }
}
