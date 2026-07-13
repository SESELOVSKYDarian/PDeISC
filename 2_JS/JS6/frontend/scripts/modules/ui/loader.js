// controla el estado de "cargando" en botones y contenedores
export function activarCargaBoton(boton, textoCargando = 'Cargando...') {
  boton.dataset.textoOriginal = boton.innerHTML;
  boton.disabled = true;
  boton.innerHTML = `<span class="cargando-spinner" style="width:1.1rem;height:1.1rem;border-width:2px;"></span> ${textoCargando}`;
}

export function desactivarCargaBoton(boton) {
  boton.disabled = false;
  if (boton.dataset.textoOriginal) {
    boton.innerHTML = boton.dataset.textoOriginal;
  }
}

export function mostrarLoaderEnContenedor(contenedor, mensaje = 'Cargando...') {
  if (contenedor.tagName === 'TBODY') {
    contenedor.innerHTML = `
      <tr><td colspan="99">
        <div class="centrado" style="padding: 2rem;">
          <div class="cargando-spinner" style="margin-inline:auto;"></div>
          <p style="margin-top:0.8rem;">${mensaje}</p>
        </div>
      </td></tr>
    `;
    return;
  }
  contenedor.innerHTML = `
    <div class="centrado" style="padding: 2rem;">
      <div class="cargando-spinner" style="margin-inline:auto;"></div>
      <p style="margin-top:0.8rem;">${mensaje}</p>
    </div>
  `;
}
