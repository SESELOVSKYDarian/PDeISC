export function renderizarAlumnos(alumnos, contenedor) {
  contenedor.innerHTML = "";

  if (!Array.isArray(alumnos) || alumnos.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="estado-vacio">
          <div class="estado-vacio-icono" aria-hidden="true">
            <i data-lucide="user-round-search"></i>
          </div>
          <h3 class="h5 mb-2">No llegaron alumnos</h3>
          <p class="text-secundario mb-0">El Proyecto 1 respondió sin registros.</p>
        </div>
      </div>
    `;
    lucide.createIcons();
    return;
  }

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
      </article>
    `;

    contenedor.appendChild(columna);
  });

  lucide.createIcons();
}

export function renderizarJson(pre, data) {
  pre.textContent = JSON.stringify(data, null, 2);
}

