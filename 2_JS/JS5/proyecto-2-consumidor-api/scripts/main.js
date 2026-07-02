import { obtenerAlumnosExterna } from "./modules/apiExterna.js";
import { renderizarAlumnos, renderizarJson } from "./modules/renderAlumnos.js";
import { obtenerTemaGuardado } from "../context/themeContext.js";
import { aplicarTema, alternarTema } from "./modules/tema.js";
import { controlarBotonSubir, subirArriba } from "./modules/scroll.js";

const contenedorAlumnos = document.querySelector("#contenedor-alumnos");
const salidaJson = document.querySelector("#salida-json");
const mensajeEstado = document.querySelector("#mensaje-estado");
const botonRecargar = document.querySelector("#btn-recargar");
const botonTema = document.querySelector("#btn-tema");
const botonSubir = document.querySelector("#btn-subir");
const linkTema = document.querySelector("#tema-css");

async function cargarAlumnos() {
  try {
    mensajeEstado.textContent = "Cargando alumnos desde el Proyecto 1...";
    mensajeEstado.className = "mensaje-listado texto-ok";

    const data = await obtenerAlumnosExterna();

    if (!data.ok) {
      mensajeEstado.textContent = data.mensaje || "No se pudieron obtener los alumnos";
      mensajeEstado.className = "mensaje-listado texto-error";
      renderizarJson(salidaJson, data);
      return;
    }

    renderizarAlumnos(data.alumnos, contenedorAlumnos);
    renderizarJson(salidaJson, data);
    mensajeEstado.textContent = `Se cargaron ${data.alumnos.length} alumnos desde http://localhost:3000/api/alumnos/listar`;
    mensajeEstado.className = "mensaje-listado texto-ok";
  } catch (error) {
    const mensaje =
      error.message || "No se pudo conectar con el Proyecto 1. Verificá que esté levantado en el puerto 3000.";

    mensajeEstado.textContent = mensaje;
    mensajeEstado.className = "mensaje-listado texto-error";
    salidaJson.textContent = JSON.stringify(
      {
        ok: false,
        mensaje
      },
      null,
      2
    );
    contenedorAlumnos.innerHTML = `
      <div class="col-12">
        <div class="estado-vacio">
          <div class="estado-vacio-icono" aria-hidden="true">
            <i data-lucide="circle-alert"></i>
          </div>
          <h3 class="h5 mb-2">No se pudo conectar</h3>
          <p class="text-secundario mb-0">Levantá el Proyecto 1 en el puerto 3000 y probá de nuevo.</p>
        </div>
      </div>
    `;
    lucide.createIcons();
  }
}

function inicializarTemaYScroll() {
  aplicarTema(obtenerTemaGuardado(), linkTema, botonTema);
  botonTema.addEventListener("click", () => alternarTema(linkTema, botonTema));
  botonSubir.addEventListener("click", subirArriba);
  window.addEventListener("scroll", () => controlarBotonSubir(botonSubir));
}

botonRecargar.addEventListener("click", cargarAlumnos);

inicializarTemaYScroll();
cargarAlumnos();
lucide.createIcons();

