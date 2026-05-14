// busca un elemento del dom por selector
export function $(selector) {
  return document.querySelector(selector);
}

// muestra un mensaje visual en pantalla
export function mostrarMensaje(elemento, texto, tipo = "info") {
  elemento.textContent = texto;
  elemento.className = `mensaje alert alert-${tipo}`;
  elemento.hidden = texto === "";
}

// muestra una confirmacion flotante cuando una accion termina
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

// aplica el comportamiento de "ver mas" si hay muchos elementos
function aplicarColapso(contenedor, cantidad) {
  // eliminar boton anterior si existe
  const btnAnterior = contenedor.nextElementSibling;
  if (btnAnterior && btnAnterior.classList.contains("btn-expand")) {
    btnAnterior.remove();
  }

  contenedor.classList.remove("expanded", "collapsible-list");

  if (cantidad > 5) {
    contenedor.classList.add("collapsible-list");
    const btn = document.createElement("button");
    btn.className = "btn-expand";
    btn.type = "button";
    btn.textContent = `Ver todos (${cantidad})`;
    btn.addEventListener("click", () => {
      contenedor.classList.toggle("expanded");
      const estaExpandido = contenedor.classList.contains("expanded");
      btn.textContent = estaExpandido ? "Ver menos" : `Ver todos (${cantidad})`;
      if (!estaExpandido) {
        contenedor.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
    contenedor.after(btn);
  }
}

// renderiza los numeros cargados desde el txt
export function renderNumeros(contenedor, numeros) {
  contenedor.innerHTML = "";

  numeros.forEach((numero, indice) => {
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between";
    item.innerHTML = `<span>Dato ${indice + 1}</span><strong>${numero}</strong>`;
    contenedor.appendChild(item);
  });

  aplicarColapso(contenedor, numeros.length);
}

// renderiza el paso a paso de utilidad de cada numero
export function renderProceso(contenedor, proceso) {
  contenedor.innerHTML = "";

  proceso.forEach((item) => {
    const fila = document.createElement("div");
    fila.className = `proceso-item ${item.estado === "cumple" ? "ok" : "no"}`;
    fila.innerHTML = `<strong>${item.numero}</strong><span>${item.estado}</span>`;
    contenedor.appendChild(fila);
  });

  aplicarColapso(contenedor, proceso.length);
}

// renderiza el resultado devuelto por el servidor
export function renderResultado(contenedor, resultado) {
  const factoriales = resultado.factoriales || [];
  const factorialesUtiles = resultado.factorialesUtiles || [];
  const omitidosUnDigito = resultado.omitidosUnDigito || [];

  contenedor.innerHTML = `
    <div class="resultado-grid">
      <div><span>Utiles</span><strong>${resultado.contadorUtiles}</strong></div>
      <div><span>No utiles</span><strong>${resultado.contadorNoUtiles}</strong></div>
      <div><span>Porcentaje</span><strong>${resultado.porcentaje}%</strong></div>
      <div><span>Repetidos</span><strong>${resultado.repetidos?.cantidad || 0}</strong></div>
      <div><span>Factoriales</span><strong>${factoriales.length}</strong></div>
    </div>
    <h3>Numeros utiles ordenados</h3>
    <ul class="list-group">${resultado.utiles.map((numero) => `<li class="list-group-item">${numero}</li>`).join("")}</ul>
    <h3 class="mt-4">Numeros factoriales detectados</h3>
    ${
      factoriales.length > 0
        ? `<ul class="list-group factoriales-lista">${factoriales.map((item) => `<li class="list-group-item d-flex justify-content-between"><strong>${item.numero}</strong><span>${item.expresion}</span></li>`).join("")}</ul>`
        : `<p class="text-secondary mb-0">No se encontraron numeros factoriales en el archivo leido.</p>`
    }
    <h3 class="mt-4">Factoriales dentro del filtrado</h3>
    ${
      factorialesUtiles.length > 0
        ? `<ul class="list-group factoriales-lista">${factorialesUtiles.map((item) => `<li class="list-group-item d-flex justify-content-between"><strong>${item.numero}</strong><span>${item.expresion}</span></li>`).join("")}</ul>`
        : `<p class="text-secondary mb-0">No hay factoriales entre los numeros filtrados.</p>`
    }
  `;
}

// dibuja los archivos disponibles para ver, editar y descargar
export function renderArchivos(contenedor, archivos, alVer, alEliminar, nombreUltimoArchivo = null) {
  contenedor.innerHTML = "";

  if (archivos.length === 0) {
    contenedor.innerHTML = `<p class="text-secondary mb-0">No hay archivos TXT disponibles.</p>`;
    return;
  }

  const categorias = ["Subido", "Generado", "Resultado"];
  const nombresCategorias = {
    Subido: "Archivos subidos localmente",
    Generado: "Archivos desde Generador (Servidor)",
    Resultado: "Resultados filtrados"
  };

  categorias.forEach((cat) => {
    const archivosCat = archivos.filter((a) => a.tipo === cat);
    if (archivosCat.length === 0) return;

    const seccion = document.createElement("div");
    seccion.className = "biblioteca-categoria mt-4";
    seccion.innerHTML = `<h3 class="categoria-titulo">${nombresCategorias[cat]}</h3>`;

    const grid = document.createElement("div");
    grid.className = "archivos-grid";

    archivosCat.forEach((archivo) => {
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
      grid.appendChild(card);
    });

    seccion.appendChild(grid);
    contenedor.appendChild(seccion);
  });
}

// actualiza el combo de seleccion de archivos existentes (version estetica)
export function actualizarSelectorArchivos(contenedor, archivos, alSeleccionar) {
  const btn = contenedor.querySelector("button");
  const lista = contenedor.querySelector("ul");

  // toggle de la lista
  const toggle = () => {
    lista.hidden = !lista.hidden;
    btn.classList.toggle("active", !lista.hidden);
  };

  btn.onclick = (e) => {
    e.stopPropagation();
    toggle();
  };

  // cerrar si se toca afuera
  const cerrarFuera = (e) => {
    if (!contenedor.contains(e.target)) {
      lista.hidden = true;
      btn.classList.remove("active");
    }
  };
  document.addEventListener("click", cerrarFuera);

  lista.innerHTML = "";
  const seleccionables = archivos.filter((a) => a.tipo === "Subido" || a.tipo === "Generado");

  if (seleccionables.length === 0) {
    lista.innerHTML = '<li class="dropdown-item-custom text-secondary">No hay archivos disponibles</li>';
    return;
  }

  seleccionables.forEach((archivo) => {
    const item = document.createElement("li");
    item.className = "dropdown-item-custom";
    item.innerHTML = `<strong>${archivo.nombre}</strong> <span>${archivo.tipo}</span>`;
    item.onclick = () => {
      btn.textContent = archivo.nombre;
      lista.hidden = true;
      btn.classList.remove("active");
      alSeleccionar(archivo.nombre);
    };
    lista.appendChild(item);
  });
}
