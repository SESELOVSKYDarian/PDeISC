const configuracionTipos = {
  exito: {
    icono: "circle-check",
    titulo: "Operación exitosa"
  },
  error: {
    icono: "circle-alert",
    titulo: "Algo salió mal"
  },
  info: {
    icono: "info"
  }
};

function cerrarToast(toast) {
  if (toast.classList.contains("toast-saliendo")) {
    return;
  }

  toast.classList.add("toast-saliendo");
  toast.addEventListener("animationend", (evento) => {
    if (evento.target === toast) {
      toast.remove();
    }
  });
}

export function mostrarToast(contenedor, mensaje, tipo = "info", titulo) {
  const configuracion = configuracionTipos[tipo] || configuracionTipos.info;
  const toast = document.createElement("article");
  const encabezado = document.createElement("strong");
  const texto = document.createElement("p");
  const icono = document.createElement("div");
  const contenido = document.createElement("div");
  const botonCerrar = document.createElement("button");
  const progreso = document.createElement("span");

  toast.className = `toast-app toast-${tipo}`;
  toast.setAttribute("role", tipo === "error" ? "alert" : "status");

  icono.className = "toast-icono";
  icono.innerHTML = `<i data-lucide="${configuracion.icono}"></i>`;

  encabezado.textContent = titulo || configuracion.titulo;
  texto.textContent = mensaje;
  contenido.className = "toast-contenido";
  contenido.append(encabezado, texto);

  botonCerrar.className = "toast-cerrar";
  botonCerrar.type = "button";
  botonCerrar.setAttribute("aria-label", "Cerrar notificación");
  botonCerrar.innerHTML = '<i data-lucide="x"></i>';
  botonCerrar.addEventListener("click", () => cerrarToast(toast));

  progreso.className = "toast-progreso";
  progreso.addEventListener("animationend", () => cerrarToast(toast));

  toast.append(icono, contenido, botonCerrar, progreso);
  contenedor.appendChild(toast);

  lucide.createIcons();
}

