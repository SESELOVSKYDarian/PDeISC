// meto los eventos mas nuevos arriba y no dejo que se haga eterno
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
