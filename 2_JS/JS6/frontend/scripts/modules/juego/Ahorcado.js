// esta es la clase central del juego, junta a los managers y controla el flujo completo
import { PalabraManager } from './palabra.manager.js';
import { IntentosManager } from './intentos.manager.js';
import { PuntuacionManager } from './puntuacion.manager.js';
import { ESTADOS_JUEGO } from './estadoJuego.js';

export class Ahorcado {
  constructor({ palabra, categoria, pista, dificultad }) {
    this.categoria = categoria;
    this.pista = pista;
    this.dificultad = dificultad;

    this.palabraManager = new PalabraManager(palabra);
    this.intentosManager = new IntentosManager();
    this.puntuacionManager = new PuntuacionManager();

    // array real donde guardo cada letra que el jugador ya probó
    this.letrasUtilizadas = [];

    this.estado = ESTADOS_JUEGO.JUGANDO;
    this.segundosTranscurridos = 0;
  }

  // procesa el intento de una letra: la logica central del juego
  intentarLetra(letraCruda) {
    const letra = letraCruda.toLowerCase();

    if (this.estado !== ESTADOS_JUEGO.JUGANDO) {
      return { valido: false, motivo: 'La partida ya terminó.' };
    }
    if (this.letrasUtilizadas.includes(letra)) {
      return { valido: false, motivo: 'Esa letra ya fue utilizada.' };
    }
    if (!/^[a-záéíóúñü]$/.test(letra)) {
      return { valido: false, motivo: 'Solo se permiten letras.' };
    }

    this.letrasUtilizadas.push(letra);
    const acerto = this.palabraManager.intentarLetra(letra);

    if (acerto) {
      this.puntuacionManager.sumarAcierto();
    } else {
      this.intentosManager.registrarError();
      this.puntuacionManager.restarPorError();
    }

    this.actualizarEstadoFinal();

    return {
      valido: true,
      acerto,
      letrasVisibles: this.palabraManager.obtenerLetrasVisibles(),
      intentosRestantes: this.intentosManager.quedanIntentos(),
      estado: this.estado
    };
  }

  actualizarEstadoFinal() {
    if (this.palabraManager.fueCompletada()) {
      this.estado = ESTADOS_JUEGO.GANADO;
      this.puntuacionManager.aplicarBonusPorTiempo(this.segundosTranscurridos);
    } else if (this.intentosManager.seAcabaronLosIntentos()) {
      this.estado = ESTADOS_JUEGO.PERDIDO;
    }
  }

  actualizarTiempo(segundos) {
    this.segundosTranscurridos = segundos;
  }

  obtenerResumen() {
    return {
      palabra: this.palabraManager.palabraOriginal,
      categoria: this.categoria,
      pista: this.pista,
      dificultad: this.dificultad,
      puntos: this.puntuacionManager.obtenerPuntos(),
      tiempo: this.segundosTranscurridos,
      estado: this.estado,
      gano: this.estado === ESTADOS_JUEGO.GANADO
    };
  }
}
