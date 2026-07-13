// controla el listado, creacion, edicion y borrado de palabras en el panel admin
import { PalabrasApi } from '../../api/palabras.api.js';
import { renderizarTablaPalabras, renderizarPaginacionPalabras } from '../render/admin.render.js';
import { abrirModal, cerrarModal } from '../ui/modal.js';
import { pedirConfirmacion } from '../ui/confirmDialog.js';
import { mostrarToast } from '../ui/toast.js';
import { validarPalabraFormulario } from '../validation/palabra.validation.js';
import { mostrarErrorCampo } from '../validation/form.validation.js';
import { mostrarLoaderEnContenedor, activarCargaBoton, desactivarCargaBoton } from '../ui/loader.js';

let cachePalabras = [];
let paginaActual = 1;
const PALABRAS_POR_PAGINA = 10;

function renderizarPaginaActual() {
  const totalPaginas = Math.max(1, Math.ceil(cachePalabras.length / PALABRAS_POR_PAGINA));
  paginaActual = Math.min(Math.max(1, paginaActual), totalPaginas);
  const inicio = (paginaActual - 1) * PALABRAS_POR_PAGINA;
  renderizarTablaPalabras(cachePalabras.slice(inicio, inicio + PALABRAS_POR_PAGINA));
  renderizarPaginacionPalabras(cachePalabras.length, paginaActual, PALABRAS_POR_PAGINA);
}

export function cambiarPaginaPalabras(numero) {
  paginaActual = numero;
  renderizarPaginaActual();
  document.querySelector('.admin-palabras')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export async function cargarListadoPalabras(filtros = {}) {
  const contenedor = document.querySelector('[data-cuerpo-tabla-palabras]');
  if (contenedor) mostrarLoaderEnContenedor(contenedor, 'Cargando palabras...');

  try {
    const respuesta = await PalabrasApi.listar(filtros);
    cachePalabras = respuesta.datos.palabras;
    paginaActual = 1;
    renderizarPaginaActual();
  } catch (error) {
    if (contenedor) contenedor.innerHTML = `<tr><td colspan="5" class="tabla__mensaje-error">${error.message || 'No se pudo cargar el listado.'}</td></tr>`;
    mostrarToast('No se pudo cargar el listado de palabras.', 'error');
  }
}

function formularioPalabra(datosIniciales = {}) {
  return `
    <form data-form-palabra novalidate>
      <div class="campo">
        <label class="campo__etiqueta" for="input-palabra">Palabra</label>
        <input class="campo__control" type="text" id="input-palabra" name="palabra" value="${datosIniciales.palabra || ''}" required>
        <span class="campo__mensaje-error" role="alert"></span>
      </div>
      <div class="campo">
        <label class="campo__etiqueta" for="input-categoria">Categoría</label>
        <input class="campo__control" type="text" id="input-categoria" name="categoria" value="${datosIniciales.categoria || ''}" required>
        <span class="campo__mensaje-error" role="alert"></span>
      </div>
      <div class="campo">
        <label class="campo__etiqueta" for="input-pista">Pista <small>(opcional)</small></label>
        <input class="campo__control" type="text" id="input-pista" name="pista" maxlength="160" value="${datosIniciales.pista || ''}" placeholder="Ej.: Se encuentra en una biblioteca">
        <span class="campo__mensaje-error" role="alert"></span>
      </div>
      <div class="campo">
        <label class="campo__etiqueta" for="input-dificultad">Dificultad</label>
        <select class="campo__control" id="input-dificultad" name="dificultad">
          <option value="facil" ${datosIniciales.dificultad === 'facil' ? 'selected' : ''}>Fácil</option>
          <option value="media" ${!datosIniciales.dificultad || datosIniciales.dificultad === 'media' ? 'selected' : ''}>Media</option>
          <option value="dificil" ${datosIniciales.dificultad === 'dificil' ? 'selected' : ''}>Difícil</option>
        </select>
        <span class="campo__mensaje-error" role="alert"></span>
      </div>
      <div class="modal__acciones">
        <button type="submit" class="boton boton--primario">${datosIniciales.id ? 'Guardar cambios' : 'Crear palabra'}</button>
      </div>
    </form>
  `;
}

export function abrirModalCrearPalabra() {
  abrirModal({
    titulo: 'Crear palabra',
    contenidoHtml: formularioPalabra(),
    alAbrir(cuerpo) {
      configurarSubmitFormulario(cuerpo, null);
    }
  });
}

export function abrirModalEditarPalabra(id) {
  const palabra = cachePalabras.find(p => p.id === id);
  if (!palabra) return;

  abrirModal({
    titulo: 'Editar palabra',
    contenidoHtml: formularioPalabra(palabra),
    alAbrir(cuerpo) {
      configurarSubmitFormulario(cuerpo, id);
    }
  });
}

function configurarSubmitFormulario(cuerpo, id) {
  const formulario = cuerpo.querySelector('[data-form-palabra]');

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const inputPalabra = cuerpo.querySelector('#input-palabra');
    const inputCategoria = cuerpo.querySelector('#input-categoria');
    const inputDificultad = cuerpo.querySelector('#input-dificultad');
    const inputPista = cuerpo.querySelector('#input-pista');

    const datos = {
      palabra: inputPalabra.value,
      categoria: inputCategoria.value,
      dificultad: inputDificultad.value,
      pista: inputPista.value
    };

    const { valido, errores } = validarPalabraFormulario(datos);
    mostrarErrorCampo(inputPalabra, errores.palabra || '');
    mostrarErrorCampo(inputCategoria, errores.categoria || '');
    mostrarErrorCampo(inputDificultad, errores.dificultad || '');

    if (!valido) return;

    const botonSubmit = formulario.querySelector('button[type="submit"]');
    activarCargaBoton(botonSubmit, 'Guardando...');

    try {
      if (id) {
        await PalabrasApi.actualizar(id, datos);
        mostrarToast('Palabra editada correctamente.', 'exito');
      } else {
        await PalabrasApi.crear(datos);
        mostrarToast('Palabra creada correctamente.', 'exito');
      }
      cerrarModal();
      cargarListadoPalabras();
    } catch (error) {
      mostrarToast(error.message || 'No se pudo guardar la palabra.', 'error');
    } finally {
      desactivarCargaBoton(botonSubmit);
    }
  });
}

export function confirmarEliminarPalabra(id) {
  const palabra = cachePalabras.find(p => p.id === id);
  pedirConfirmacion({
    mensaje: `¿Eliminar la palabra "${palabra?.palabra}"? Esta acción no se puede deshacer.`,
    async onConfirmar() {
      try {
        await PalabrasApi.eliminar(id);
        mostrarToast('Palabra eliminada correctamente.', 'exito');
        cargarListadoPalabras();
      } catch {
        mostrarToast('No se pudo eliminar la palabra.', 'error');
      }
    }
  });
}
