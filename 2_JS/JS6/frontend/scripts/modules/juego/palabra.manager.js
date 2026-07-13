// esta clase maneja la palabra como un array real de letras, no como un simple string
export class PalabraManager {
  constructor(palabra) {
    this.palabraOriginal = palabra.toLowerCase();

    // array real con cada letra de la palabra
    this.letrasPalabra = this.palabraOriginal.split('');

    // array paralelo que indica que letras ya fueron adivinadas
    this.letrasAdivinadas = this.letrasPalabra.map(() => false);
  }

  // marca todas las posiciones donde aparece la letra ingresada
  intentarLetra(letra) {
    let acerto = false;

    this.letrasPalabra.forEach((letraActual, indice) => {
      if (letraActual === letra) {
        this.letrasAdivinadas[indice] = true;
        acerto = true;
      }
    });

    return acerto;
  }

  // arma el array de letras visibles: la letra si ya se adivinó, o null si sigue oculta
  obtenerLetrasVisibles() {
    return this.letrasPalabra.map((letra, indice) => (this.letrasAdivinadas[indice] ? letra : null));
  }

  fueCompletada() {
    return this.letrasAdivinadas.every(Boolean);
  }
}
