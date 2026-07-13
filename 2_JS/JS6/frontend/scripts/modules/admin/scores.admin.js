// Gestion de puntajes disponible exclusivamente desde la interfaz del administrador.
import { ScoreApi } from '../../api/score.api.js';
import { formatearFechaCorta } from '../../utils/fechas.js';
import { abrirModal, cerrarModal } from '../ui/modal.js';
import { pedirConfirmacion } from '../ui/confirmDialog.js';
import { mostrarToast } from '../ui/toast.js';
import { validarScoreFormulario } from '../validation/score.validation.js';
import { mostrarErrorCampo } from '../validation/form.validation.js';
import { activarCargaBoton, desactivarCargaBoton } from '../ui/loader.js';

let cacheScores = [];
let paginaActual = 1;
const SCORES_POR_PAGINA = 10;

export function inicializarScoresAdmin() {
  const tabla = document.querySelector('[data-cuerpo-tabla-scores-admin]');
  if (!tabla) return;

  cargarScoresAdmin();

  tabla.addEventListener('click', (evento) => {
    const editar = evento.target.closest('[data-editar-score-admin]');
    const eliminar = evento.target.closest('[data-eliminar-score-admin]');
    if (editar) abrirModalEditarScore(Number(editar.dataset.editarScoreAdmin));
    if (eliminar) confirmarEliminarScore(Number(eliminar.dataset.eliminarScoreAdmin));
  });

  document.querySelector('[data-paginacion-scores-admin]')?.addEventListener('click', (evento) => {
    const boton = evento.target.closest('[data-pagina-score-admin]');
    if (!boton || boton.disabled) return;
    paginaActual = Number(boton.dataset.paginaScoreAdmin);
    cargarScoresAdmin();
  });
}

async function cargarScoresAdmin() {
  const cuerpo = document.querySelector('[data-cuerpo-tabla-scores-admin]');
  if (cuerpo) cuerpo.innerHTML = '<tr><td colspan="5">Cargando puntajes...</td></tr>';

  try {
    const respuesta = await ScoreApi.listar({
      orden: 'puntos',
      direccion: 'DESC',
      pagina: paginaActual,
      porPagina: SCORES_POR_PAGINA
    });
    cacheScores = respuesta.datos.scores;

    if (cacheScores.length === 0 && paginaActual > 1) {
      paginaActual -= 1;
      return cargarScoresAdmin();
    }

    renderizarTabla(cacheScores);
    renderizarPaginacion(respuesta.datos.total);
  } catch (error) {
    if (cuerpo) cuerpo.innerHTML = '<tr><td colspan="5">No se pudieron cargar los puntajes.</td></tr>';
    mostrarToast(error.message || 'No se pudieron cargar los puntajes.', 'error');
  }
}

function renderizarTabla(scores) {
  const cuerpo = document.querySelector('[data-cuerpo-tabla-scores-admin]');
  if (!cuerpo) return;

  if (!scores.length) {
    cuerpo.innerHTML = '<tr><td colspan="5">Todavía no hay puntajes guardados.</td></tr>';
    return;
  }

  cuerpo.innerHTML = scores.map(score => `
    <tr>
      <td>${score.nombre}</td>
      <td>${score.puntos}</td>
      <td>${score.tiempo}s</td>
      <td>${formatearFechaCorta(score.fecha)}</td>
      <td class="tabla__acciones">
        <button type="button" class="boton boton--chico boton--icono" data-editar-score-admin="${score.id}" aria-label="Editar score de ${score.nombre}">
          <span class="icono-mask icono-mask--pencil" aria-hidden="true"></span>
        </button>
        <button type="button" class="boton boton--chico boton--icono boton--peligro" data-eliminar-score-admin="${score.id}" aria-label="Eliminar score de ${score.nombre}">
          <span class="icono-mask icono-mask--trash" aria-hidden="true"></span>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderizarPaginacion(total) {
  const contenedor = document.querySelector('[data-paginacion-scores-admin]');
  if (!contenedor) return;
  const totalPaginas = Math.max(1, Math.ceil(total / SCORES_POR_PAGINA));
  if (totalPaginas === 1) {
    contenedor.innerHTML = '';
    return;
  }

  contenedor.innerHTML = Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(numero => `
    <button type="button" class="boton boton--chico paginacion__boton" data-pagina-score-admin="${numero}" ${numero === paginaActual ? 'aria-current="page"' : ''}>
      ${numero}
    </button>
  `).join('');
}

function abrirModalEditarScore(id) {
  const score = cacheScores.find(item => item.id === id);
  if (!score) return;

  abrirModal({
    titulo: 'Editar score',
    contenidoHtml: `
      <form data-form-editar-score novalidate>
        <div class="campo">
          <label class="campo__etiqueta" for="editar-nombre">Nombre</label>
          <input class="campo__control" type="text" id="editar-nombre" value="${score.nombre}" required>
          <span class="campo__mensaje-error" role="alert"></span>
        </div>
        <div class="campo">
          <label class="campo__etiqueta" for="editar-puntos">Puntos</label>
          <input class="campo__control" type="number" min="0" id="editar-puntos" value="${score.puntos}" required>
          <span class="campo__mensaje-error" role="alert"></span>
        </div>
        <div class="campo">
          <label class="campo__etiqueta" for="editar-tiempo">Tiempo (segundos)</label>
          <input class="campo__control" type="number" min="0" id="editar-tiempo" value="${score.tiempo}" required>
          <span class="campo__mensaje-error" role="alert"></span>
        </div>
        <div class="modal__acciones">
          <button type="submit" class="boton boton--primario">Guardar cambios</button>
        </div>
      </form>
    `,
    alAbrir(cuerpo) {
      const formulario = cuerpo.querySelector('[data-form-editar-score]');
      formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const nombre = cuerpo.querySelector('#editar-nombre');
        const puntos = cuerpo.querySelector('#editar-puntos');
        const tiempo = cuerpo.querySelector('#editar-tiempo');
        const { valido, errores } = validarScoreFormulario({ nombre: nombre.value, puntos: puntos.value, tiempo: tiempo.value });

        mostrarErrorCampo(nombre, errores.nombre || '');
        mostrarErrorCampo(puntos, errores.puntos || '');
        mostrarErrorCampo(tiempo, errores.tiempo || '');
        if (!valido) return;

        const boton = formulario.querySelector('button[type="submit"]');
        activarCargaBoton(boton, 'Guardando...');
        try {
          await ScoreApi.actualizar(id, {
            nombre: nombre.value.trim(),
            puntos: Number(puntos.value),
            tiempo: Number(tiempo.value)
          });
          mostrarToast('Score actualizado correctamente.', 'exito');
          cerrarModal();
          cargarScoresAdmin();
        } catch {
          mostrarToast('No se pudo actualizar el score.', 'error');
        } finally {
          desactivarCargaBoton(boton);
        }
      });
    }
  });
}

function confirmarEliminarScore(id) {
  const score = cacheScores.find(item => item.id === id);
  if (!score) return;

  pedirConfirmacion({
    mensaje: `¿Eliminar el score de "${score.nombre}"? Esta acción no se puede deshacer.`,
    async onConfirmar() {
      try {
        await ScoreApi.eliminar(id);
        mostrarToast('Score eliminado correctamente.', 'exito');
        cargarScoresAdmin();
      } catch {
        mostrarToast('No se pudo eliminar el score.', 'error');
      }
    }
  });
}
