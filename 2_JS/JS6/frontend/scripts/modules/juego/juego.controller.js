// coordina la clase Ahorcado con la API y con los modulos de renderizado
import { Ahorcado } from './Ahorcado.js';
import { PalabrasApi } from '../../api/palabras.api.js';
import { ESTADOS_JUEGO } from './estadoJuego.js';
import { PARTES_AHORCADO } from '../../utils/constants.js';

export class JuegoController {
  constructor({ onActualizar, onFinDePartida }) {
    this.onActualizar = onActualizar;
    this.onFinDePartida = onFinDePartida;
    this.ahorcado = null;
    this.intervaloTiempo = null;
    this.segundos = 0;
  }

  // pide una palabra real a la API (nunca un array local) e inicia la partida
  async iniciarPartida(dificultad, categorias = []) {
    this.detenerCronometro();

    const respuesta = await PalabrasApi.aleatoria(dificultad, categorias);
    const { palabra, categoria, pista, dificultad: dificultadReal } = respuesta.datos.palabra;

    this.ahorcado = new Ahorcado({ palabra, categoria, pista, dificultad: dificultadReal });
    this.segundos = 0;

    this.iniciarCronometro();
    this.notificarCambios();

    return this.ahorcado;
  }

  iniciarCronometro() {
    this.intervaloTiempo = setInterval(() => {
      this.segundos++;
      this.ahorcado.actualizarTiempo(this.segundos);
      this.notificarCambios(false);
    }, 1000);
  }

  detenerCronometro() {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
      this.intervaloTiempo = null;
    }
  }

  procesarLetra(letra) {
    if (!this.ahorcado) return null;

    const resultado = this.ahorcado.intentarLetra(letra);

    if (resultado.valido) {
      this.notificarCambios();

      if (resultado.estado !== ESTADOS_JUEGO.JUGANDO) {
        this.detenerCronometro();
        this.onFinDePartida(this.ahorcado.obtenerResumen(), resultado);
      }
    }

    return resultado;
  }

  // calcula cuantas partes del ahorcado deberian estar visibles segun los errores actuales
  obtenerPartesVisibles() {
    const errores = this.ahorcado.intentosManager.errores;
    return PARTES_AHORCADO.slice(0, errores);
  }

  notificarCambios(incluirTiempo = true) {
    this.onActualizar(this.ahorcado, incluirTiempo);
  }
}
