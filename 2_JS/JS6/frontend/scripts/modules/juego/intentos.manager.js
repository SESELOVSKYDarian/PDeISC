// controla cuantos errores lleva el jugador y cuando se acaban los intentos
import { INTENTOS_MAXIMOS } from '../../utils/constants.js';

export class IntentosManager {
  constructor(maximos = INTENTOS_MAXIMOS) {
    this.maximos = maximos;
    this.errores = 0;
  }

  registrarError() {
    this.errores++;
    return this.errores;
  }

  quedanIntentos() {
    return this.maximos - this.errores;
  }

  seAcabaronLosIntentos() {
    return this.errores >= this.maximos;
  }

  reiniciar() {
    this.errores = 0;
  }
}
