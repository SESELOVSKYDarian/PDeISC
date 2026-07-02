export function pintarCampo(input, error, mensaje) {
  mensaje.textContent = error;

  input.classList.remove("is-valid", "is-invalid");

  if (error) {
    input.classList.add("is-invalid");
    return;
  }

  if (input.value.trim() !== "") {
    input.classList.add("is-valid");
  }
}

export function renderizarAlumnos(alumnos, contenedor, mensajeListado, onEditar, onEliminar) {
  contenedor.innerHTML = "";

  if (!Array.isArray(alumnos) || alumnos.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="estado-vacio">
          <div class="estado-vacio-icono" aria-hidden="true">
            <i data-lucide="user-round-plus"></i>
          </div>
          <h3 class="h5 mb-2">Todavía no hay alumnos</h3>
          <p class="text-secundario mb-0">Usá el botón de carga para crear el primer registro.</p>
        </div>
      </div>
    `;
    mensajeListado.textContent = "";
    lucide.createIcons();
    return;
  }

  mensajeListado.textContent = "";

  alumnos.forEach((alumno, indice) => {
    const columna = document.createElement("div");
    columna.className = "col-md-6 col-xl-4";
    columna.style.setProperty("--demora", `${indice * 55}ms`);

    columna.innerHTML = `
      <article class="tarjeta-alumno p-3">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="alumno-id">${alumno.id}</div>
          <div class="alumno-datos">
            <h3 class="h5 mb-0">${alumno.nombre} ${alumno.apellido}</h3>
            <p class="mb-0 text-secundario">
              <i data-lucide="calendar-days"></i>
              ${alumno.edad} años
            </p>
          </div>
        </div>
        <div class="acciones-alumno">
          <button
            class="btn btn-icono btn-secundario btn-editar"
            type="button"
            aria-label="Editar a ${alumno.nombre} ${alumno.apellido}"
            title="Editar alumno"
          >
            <i data-lucide="pencil"></i>
          </button>
          <button
            class="btn btn-icono btn-peligro btn-eliminar"
            type="button"
            aria-label="Eliminar a ${alumno.nombre} ${alumno.apellido}"
            title="Eliminar alumno"
          >
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </article>
    `;

    columna.querySelector(".btn-editar").addEventListener("click", () => onEditar(alumno));
    columna.querySelector(".btn-eliminar").addEventListener("click", () => onEliminar(alumno));

    contenedor.appendChild(columna);
  });

  lucide.createIcons();
}

export function limpiarFormulario(formulario, campos, mensajes) {
  formulario.reset();

  Object.values(campos).forEach((campo) => {
    campo.classList.remove("is-valid", "is-invalid");
  });

  Object.values(mensajes).forEach((mensaje) => {
    mensaje.textContent = "";
  });
}

export function activarModoEdicion(alumno, campos, titulo, botonGuardar, botonCancelar) {
  campos.id.value = alumno.id;
  campos.nombre.value = alumno.nombre;
  campos.apellido.value = alumno.apellido;
  campos.edad.value = alumno.edad;

  titulo.textContent = "Editar alumno";
  botonGuardar.innerHTML = '<i data-lucide="save"></i><span>Guardar cambios</span>';
  botonCancelar.textContent = "Cancelar edición";
  botonCancelar.classList.remove("d-none");

  lucide.createIcons();
}

export function activarModoCreacion(campos, titulo, botonGuardar, botonCancelar) {
  campos.id.value = "";
  titulo.textContent = "Cargar alumno";
  botonGuardar.innerHTML = '<i data-lucide="save"></i><span>Guardar alumno</span>';
  botonCancelar.textContent = "Cancelar";
  botonCancelar.classList.remove("d-none");

  lucide.createIcons();
}

export function mostrarEstado(elemento, mensaje, ok = true) {
  elemento.textContent = mensaje;
  elemento.classList.toggle("texto-ok", ok);
  elemento.classList.toggle("texto-error", !ok);
}

export function renderizarJson(pre, data) {
  pre.textContent = JSON.stringify(data, null, 2);
}

