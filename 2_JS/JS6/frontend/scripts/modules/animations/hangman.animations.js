// controla como aparece cada parte del dibujo del ahorcado, con su trazo animado
export function mostrarParteAhorcado(svgEl, nombreParte) {
  const parte = svgEl.querySelector(`[data-parte="${nombreParte}"]`);
  if (!parte) return;

  // calculo el largo real del trazo para que la animacion de "dibujado" quede prolija
  const largo = parte.getTotalLength ? parte.getTotalLength() : 300;
  parte.style.setProperty('--largo-trazo', largo);
  parte.style.strokeDasharray = largo;
  parte.style.strokeDashoffset = largo;

  parte.classList.add('hangman__parte--visible');
}

export function reiniciarDibujoAhorcado(svgEl) {
  svgEl.querySelectorAll('[data-parte]').forEach(parte => {
    parte.classList.remove('hangman__parte--visible');
    parte.style.strokeDashoffset = '';
  });
  svgEl.classList.remove('hangman--derrota', 'hangman--victoria');
}

export function reproducirAnimacionFinal(svgEl, gano) {
  svgEl.classList.add(gano ? 'hangman--victoria' : 'hangman--derrota');
}
