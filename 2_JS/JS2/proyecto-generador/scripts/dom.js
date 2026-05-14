// busca un elemento del dom por selector
export function $(selector) {
  return document.querySelector(selector);
}

// renderiza la lista de numeros cargados
export function renderNumeros(lista, numeros) {
  lista.innerHTML = "";

  numeros.forEach((numero, indice) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between";
    item.innerHTML = `<span>Numero ${indice + 1}</span><strong>${numero}</strong>`;
    lista.appendChild(item);
  });
}

// muestra un mensaje visual sin usar alert
export function mostrarMensaje(elemento, texto, tipo = "info") {
  elemento.textContent = texto;
  elemento.className = `mensaje alert alert-${tipo}`;
  elemento.hidden = texto === "";
}

// muestra una confirmacion flotante para acciones terminadas
export function mostrarToast(texto, tipo = "success") {
  const toastAnterior = document.querySelector(".app-toast");
  if (toastAnterior) toastAnterior.remove();

  const toast = document.createElement("div");
  toast.className = `app-toast app-toast-${tipo}`;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.textContent = texto;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("app-toast-out");
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

// dibuja las tarjetas de archivos disponibles
export function renderArchivos(contenedor, archivos, alVer, alEliminar, nombreUltimoArchivo = null) {
  contenedor.innerHTML = "";

  if (archivos.length === 0) {
    contenedor.innerHTML = `<p class="text-secondary mb-0">Todavia no hay archivos TXT generados.</p>`;
    return;
  }

  archivos.forEach((archivo) => {
    const card = document.createElement("article");
    const esUltimo = archivo.nombre === nombreUltimoArchivo;
    card.className = `archivo-card${esUltimo ? " latest-file" : ""}`;
    card.innerHTML = `
      <div>
        <h3>${archivo.nombre}</h3>
        <p>Creado el ${archivo.fechaCreacion} - ${archivo.bytes} bytes</p>
      </div>
      <div class="acciones-archivo">
        <button class="btn btn-outline-primary btn-sm btn-ver" type="button">Ver y editar</button>
        <a class="btn btn-outline-success btn-sm" href="/api/archivos/${encodeURIComponent(archivo.nombre)}/descargar">Descargar</a>
        <button class="btn btn-outline-danger btn-sm btn-eliminar" type="button">Eliminar</button>
      </div>
    `;
    card.querySelector(".btn-ver").addEventListener("click", () => alVer(archivo.nombre));
    card.querySelector(".btn-eliminar").addEventListener("click", () => alEliminar(archivo.nombre));
    contenedor.appendChild(card);
  });
}
