// calcula el puntaje de la partida en base a aciertos, errores y tiempo
import { PUNTOS_POR_LETRA_CORRECTA, PENALIZACION_POR_ERROR } from '../../utils/constants.js';

export class PuntuacionManager {
  constructor() {
    this.puntos = 0;
  }

  sumarAcierto() {
    this.puntos += PUNTOS_POR_LETRA_CORRECTA;
  }

  restarPorError() {
    this.puntos = Math.max(0, this.puntos - PENALIZACION_POR_ERROR);
  }

  aplicarBonusPorTiempo(segundosUsados) {
    // cuanto menos tiempo se use, mayor el bonus (con un piso de 0)
    const bonus = Math.max(0, 60 - segundosUsados);
    this.puntos += bonus;
    return this.puntos;
  }

  obtenerPuntos() {
    return this.puntos;
  }

  reiniciar() {
    this.puntos = 0;
  }
}
