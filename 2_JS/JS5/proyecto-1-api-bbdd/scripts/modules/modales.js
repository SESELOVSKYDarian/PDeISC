const cierresActivos = new WeakMap();

export function abrirModal(modal, elementoFoco) {
  modal.classList.remove("modal-cerrando");
  modal.showModal();

  window.requestAnimationFrame(() => elementoFoco?.focus());
}

export function cerrarModal(modal) {
  if (cierresActivos.has(modal)) {
    return cierresActivos.get(modal);
  }

  if (!modal.open) {
    return Promise.resolve();
  }

  modal.classList.add("modal-cerrando");

  const cierre = new Promise((resolver) => {
    let cerrado = false;
    let temporizador;

    const alTerminarAnimacion = (evento) => {
      if (evento.target === modal) {
        finalizarCierre();
      }
    };

    const finalizarCierre = () => {
      if (cerrado) {
        return;
      }

      cerrado = true;
      window.clearTimeout(temporizador);
      modal.removeEventListener("animationend", alTerminarAnimacion);
      cierresActivos.delete(modal);
      modal.classList.remove("modal-cerrando");
      modal.close();
      resolver();
    };

    modal.addEventListener("animationend", alTerminarAnimacion);
    temporizador = window.setTimeout(finalizarCierre, 260);
  });

  cierresActivos.set(modal, cierre);

  return cierre;
}

