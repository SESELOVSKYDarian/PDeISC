// agrego una linea nueva al log
export function addLogItem(changesLog, message) {
  if (changesLog.children.length === 1 && changesLog.textContent.includes('Sin cambios')) {
    changesLog.innerHTML = '';
  }

  const item = document.createElement('li');
  item.className = 'list-group-item px-0';
  item.textContent = message;
  changesLog.appendChild(item);
}

// esto deja un mensaje inicial en el log
export function setInitialLog(changesLog, message) {
  changesLog.innerHTML = `<li class="list-group-item px-0">${message}</li>`;
}
