// conecta el teclado virtual, el teclado fisico y los botones del juego con el controller
import { JuegoController } from '../juego/juego.controller.js';
import { renderizarPanelInfo } from '../render/juego.render.js';
import { renderizarPalabraOculta } from '../render/palabra.render.js';
import { mostrarParteAhorcado, reiniciarDibujoAhorcado, reproducirAnimacionFinal } from '../animations/hangman.animations.js';
import { animarTeclaIncorrecta } from '../animations/letters.animations.js';
import { mostrarToast } from '../ui/toast.js';
import { abrirModal, cerrarModal } from '../ui/modal.js';
import { validarScoreFormulario } from '../validation/score.validation.js';
import { mostrarErrorCampo } from '../validation/form.validation.js';
import { ScoreApi } from '../../api/score.api.js';
import { PdfApi } from '../../api/pdf.api.js';
import { PalabrasApi } from '../../api/palabras.api.js';
import { guardarUltimoNombre, leerUltimoNombre } from '../../storage/preferences.storage.js';
import { activarCargaBoton, desactivarCargaBoton } from '../ui/loader.js';
import { ESTADOS_JUEGO } from '../juego/estadoJuego.js';

const ALFABETO = 'abcdefghijklmnopqrstuvwxyzñ'.split('');

let controller = null;
let dificultadSeleccionada = 'media';
let categoriasSeleccionadas = [];

export function inicializarEventosJuego() {
  const svgAhorcado = document.querySelector('[data-svg-ahorcado]');
  const contenedorTeclado = document.querySelector('[data-teclado]');
  const botonNuevaPartida = document.querySelector('[data-nueva-partida]');

  if (!svgAhorcado || !contenedorTeclado) return;

  construirTeclado(contenedorTeclado);

  controller = new JuegoController({
    onActualizar: (ahorcado) => {
      renderizarPanelInfo(ahorcado);
      renderizarPalabraOculta(ahorcado);
    },
    onFinDePartida: (resumen, resultado) => manejarFinDePartida(resumen, resultado, svgAhorcado)
  });

  const iniciar = async () => {
    try {
      botonNuevaPartida.disabled = true;
      reiniciarDibujoAhorcado(svgAhorcado);
      await controller.iniciarPartida(dificultadSeleccionada, categoriasSeleccionadas);
      habilitarTeclado(contenedorTeclado, true);
      const botonPista = document.querySelector('[data-boton-pista]');
      if (botonPista) botonPista.hidden = !controller.ahorcado.pista;
      document.querySelector('[data-estado-inicial]')?.classList.add('estado-inicial--oculto');
      botonNuevaPartida.innerHTML = '<i data-lucide="refresh-cw"></i> Nueva partida';
      if (window.lucide) window.lucide.createIcons();
    } catch (error) {
      mostrarToast('No se pudo obtener una palabra desde el servidor.', 'error');
    } finally {
      botonNuevaPartida.disabled = false;
    }
  };

  botonNuevaPartida?.addEventListener('click', () => {
    if (!controller.ahorcado || controller.ahorcado.estado !== ESTADOS_JUEGO.JUGANDO) abrirModalInicio(iniciar);
    else mostrarToast('Terminá la partida actual antes de cambiar la dificultad.', 'info');
  });

  contenedorTeclado.addEventListener('click', (evento) => {
    const tecla = evento.target.closest('.tecla');
    if (tecla && !tecla.disabled) {
      procesarLetra(tecla.dataset.letra, tecla, svgAhorcado);
    }
  });

  document.querySelector('[data-boton-pista]')?.addEventListener('click', () => {
    if (controller?.ahorcado?.pista) mostrarToast(`Pista: ${controller.ahorcado.pista}`, 'info');
  });

  // soporte para teclado fisico
  document.addEventListener('keydown', (evento) => {
    const letra = evento.key.toLowerCase();
    const teclaVirtual = contenedorTeclado.querySelector(`[data-letra="${letra}"]`);
    if (teclaVirtual && !teclaVirtual.disabled) {
      procesarLetra(letra, teclaVirtual, svgAhorcado);
    }
  });

  // el juego queda preparado, pero el tiempo comienza solo cuando la persona lo decide
  habilitarTeclado(contenedorTeclado, false);
  mostrarFlujoDeBienvenida(iniciar);
}

function mostrarFlujoDeBienvenida(iniciar) {
  if (localStorage.getItem('ahorcado_tutorial_visto') === 'true') return abrirModalInicio(iniciar);
  abrirModal({
    titulo: 'Como jugar',
    contenidoHtml: `<div class="tutorial" data-tutorial><section class="tutorial__paso tutorial__paso--activo"><b>1 de 2</b><h4>Adivina la palabra</h4><p>Usa el teclado virtual o fisico para probar letras.</p></section><section class="tutorial__paso" aria-hidden="true"><b>2 de 2</b><h4>Tienes 6 intentos</h4><p>Cada error dibuja una parte del ahorcado. Si se terminan, pierdes la partida.</p></section><div class="modal__acciones"><button type="button" class="boton" data-tutorial-siguiente>Siguiente</button></div></div>`,
    alAbrir(cuerpo) {
      let paso = 0;
      const pasos = [...cuerpo.querySelectorAll('.tutorial__paso')];
      cuerpo.querySelector('[data-tutorial-siguiente]').addEventListener('click', (evento) => {
        if (paso === 0) {
          paso = 1;
          pasos.forEach((item, indice) => { item.classList.toggle('tutorial__paso--activo', indice === paso); item.setAttribute('aria-hidden', String(indice !== paso)); });
          evento.currentTarget.textContent = 'Elegir dificultad';
          return;
        }
        localStorage.setItem('ahorcado_tutorial_visto', 'true');
        cerrarModal();
        setTimeout(() => abrirModalInicio(iniciar), 300);
      });
    }
  });
}

function abrirModalInicio(iniciar) {
  abrirModal({
    titulo: 'Empeza a jugar',
    contenidoHtml: `<div class="inicio-partida"><section class="inicio-partida__paso inicio-partida__paso--activo" data-paso-inicio="categorias"><p class="inicio-partida__texto">Paso 1 de 2: elegí una o varias categorías.</p><fieldset class="selector-categorias"><legend>Categorías</legend><div data-categorias-juego class="selector-categorias__lista">Cargando categorías...</div><p class="selector-categorias__error" data-error-categorias role="alert"></p></fieldset><div class="modal__acciones"><button type="button" class="boton boton--primario" data-siguiente-inicio disabled>Siguiente</button></div></section><section class="inicio-partida__paso" data-paso-inicio="dificultad" hidden><p class="inicio-partida__texto">Paso 2 de 2: elegí una dificultad. No podrás cambiarla hasta terminar la partida.</p><fieldset class="selector-dificultad" aria-label="Dificultad"><label class="selector-dificultad__opcion"><input type="radio" name="dificultad" value="facil"><span><strong>Fácil</strong><small>Palabras simples</small></span></label><label class="selector-dificultad__opcion selector-dificultad__opcion--seleccionada"><input type="radio" name="dificultad" value="media" checked><span><strong>Media</strong><small>El equilibrio ideal</small></span></label><label class="selector-dificultad__opcion"><input type="radio" name="dificultad" value="dificil"><span><strong>Difícil</strong><small>Para expertos</small></span></label></fieldset><div class="modal__acciones"><button type="button" class="boton" data-anterior-inicio>Atrás</button><button type="button" class="boton boton--primario" data-comenzar-partida>Comenzar partida</button></div></section></div>`,
    alAbrir(cuerpo) {
      const opciones = [...cuerpo.querySelectorAll('.selector-dificultad__opcion')];
      opciones.forEach(opcion => opcion.addEventListener('change', () => opciones.forEach(item => item.classList.toggle('selector-dificultad__opcion--seleccionada', item.querySelector('input').checked))));
      const cambiarPaso = (paso) => cuerpo.querySelectorAll('[data-paso-inicio]').forEach(seccion => {
        const activo = seccion.dataset.pasoInicio === paso;
        seccion.hidden = !activo;
        seccion.classList.toggle('inicio-partida__paso--activo', activo);
      });
      const botonSiguiente = cuerpo.querySelector('[data-siguiente-inicio]');
      botonSiguiente.addEventListener('click', () => {
        categoriasSeleccionadas = [...cuerpo.querySelectorAll('input[name="categoria-juego"]:checked')].map(input => input.value);
        if (!categoriasSeleccionadas.length) {
          cuerpo.querySelector('[data-error-categorias]').textContent = 'Elegí al menos una categoría para continuar.';
          return;
        }
        cambiarPaso('dificultad');
      });
      cuerpo.querySelector('[data-anterior-inicio]').addEventListener('click', () => cambiarPaso('categorias'));
      cuerpo.querySelector('[data-comenzar-partida]').addEventListener('click', async () => {
        dificultadSeleccionada = cuerpo.querySelector('input[name="dificultad"]:checked').value;
        cerrarModal();
        await iniciar();
      });
      PalabrasApi.categorias().then(respuesta => {
        const categorias = respuesta.datos.categorias;
        const lista = cuerpo.querySelector('[data-categorias-juego]');
        lista.innerHTML = categorias.length ? categorias.map(categoria => `<label><input type="checkbox" name="categoria-juego" value="${categoria}"> ${categoria}</label>`).join('') : 'No hay categorias disponibles.';
        lista.addEventListener('change', () => {
          const haySeleccion = Boolean(lista.querySelector('input:checked'));
          botonSiguiente.disabled = !haySeleccion;
          cuerpo.querySelector('[data-error-categorias]').textContent = '';
        });
      }).catch(() => { cuerpo.querySelector('[data-categorias-juego]').textContent = 'No se pudieron cargar las categorias.'; });
    }
  });
}

function construirTeclado(contenedor) {
  contenedor.innerHTML = ALFABETO.map(letra => `
    <button type="button" class="tecla" data-letra="${letra}" aria-label="Letra ${letra}">${letra}</button>
  `).join('');
}

function habilitarTeclado(contenedor, habilitar) {
  contenedor.querySelectorAll('.tecla').forEach(tecla => {
    tecla.disabled = !habilitar;
    tecla.classList.remove('tecla--correcta', 'tecla--incorrecta');
  });
}

function procesarLetra(letra, teclaEl, svgAhorcado) {
  const resultado = controller.procesarLetra(letra);
  if (!resultado || !resultado.valido) return;

  teclaEl.disabled = true;

  if (resultado.acerto) {
    teclaEl.classList.add('tecla--correcta');
  } else {
    teclaEl.classList.add('tecla--incorrecta');
    animarTeclaIncorrecta(teclaEl);
    mostrarParteAhorcado(svgAhorcado, controller.obtenerPartesVisibles().slice(-1)[0]);
  }
}

function manejarFinDePartida(resumen, resultado, svgAhorcado) {
  const contenedorTeclado = document.querySelector('[data-teclado]');
  habilitarTeclado(contenedorTeclado, false);
  reproducirAnimacionFinal(svgAhorcado, resumen.gano);

  if (resumen.gano) {
    mostrarToast('¡Ganaste la partida!', 'exito');
  } else {
    mostrarToast(`Perdiste. La palabra era "${resumen.palabra}".`, 'error');
  }

  abrirModalResultado(resumen);
  const botonNuevaPartida = document.querySelector('[data-nueva-partida]');
  if (botonNuevaPartida) botonNuevaPartida.innerHTML = '<i data-lucide="rotate-ccw"></i> Volver a jugar';
  if (window.lucide) window.lucide.createIcons();
}

function abrirModalResultado(resumen) {
  const nombreGuardado = leerUltimoNombre();

  abrirModal({
    titulo: resumen.gano ? '¡Victoria!' : 'Partida terminada',
    contenidoHtml: `
      <p>Palabra: <strong>${resumen.palabra}</strong></p>
      <p>Puntos obtenidos: <strong>${resumen.puntos}</strong></p>
      <p>Tiempo: <strong>${resumen.tiempo}s</strong></p>
      <form data-form-guardar-score novalidate>
        <div class="campo">
          <label class="campo__etiqueta" for="input-nombre-score">Tu nombre</label>
          <input class="campo__control" type="text" id="input-nombre-score" name="nombre" value="${nombreGuardado}" required>
          <span class="campo__mensaje-error" role="alert"></span>
        </div>
        <div class="modal__acciones">
          <button type="button" class="boton" data-descargar-pdf-score>Descargar PDF</button>
          <button type="submit" class="boton boton--primario">Guardar score</button>
        </div>
      </form>
    `,
    alAbrir(cuerpo) {
      const formulario = cuerpo.querySelector('[data-form-guardar-score]');
      const inputNombre = cuerpo.querySelector('#input-nombre-score');

      formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const { valido, errores } = validarScoreFormulario({
          nombre: inputNombre.value,
          tiempo: resumen.tiempo,
          puntos: resumen.puntos
        });

        if (!valido) {
          mostrarErrorCampo(inputNombre, errores.nombre || '');
          return;
        }

        const botonSubmit = formulario.querySelector('button[type="submit"]');
        activarCargaBoton(botonSubmit, 'Guardando...');

        try {
          await ScoreApi.crear({ nombre: inputNombre.value.trim(), tiempo: resumen.tiempo, puntos: resumen.puntos });
          guardarUltimoNombre(inputNombre.value.trim());
          mostrarToast('Score guardado correctamente.', 'exito');
          cerrarModal();
        } catch {
          mostrarToast('No se pudo guardar el score.', 'error');
        } finally {
          desactivarCargaBoton(botonSubmit);
        }
      });

      cuerpo.querySelector('[data-descargar-pdf-score]').addEventListener('click', async () => {
        const { valido, errores } = validarScoreFormulario({ nombre: inputNombre.value, tiempo: resumen.tiempo, puntos: resumen.puntos });
        if (!valido) {
          mostrarErrorCampo(inputNombre, errores.nombre || 'Ingresá tu nombre antes de descargar el PDF.');
          inputNombre.focus();
          return;
        }
        try {
          await PdfApi.descargarScoreActual({
            nombre: inputNombre.value.trim() || 'Jugador',
            puntos: resumen.puntos,
            tiempo: resumen.tiempo,
            fecha: new Date().toISOString(),
            palabra: resumen.palabra,
            dificultad: resumen.dificultad,
            resultado: resumen.gano ? 'Ganó' : 'Perdió'
          });
          mostrarToast('PDF generado correctamente.', 'exito');
        } catch {
          mostrarToast('No se pudo generar el PDF.', 'error');
        }
      });
    }
  });
}
