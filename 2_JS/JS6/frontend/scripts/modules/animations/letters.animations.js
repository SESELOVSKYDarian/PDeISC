// pequeña animacion cuando se revela una letra correcta en la palabra oculta
export function animarLetraRevelada(elementoLetra) {
  elementoLetra.classList.add('palabra-oculta__letra--revelada');
}

// animacion de "temblor" para una tecla que resulto incorrecta
export function animarTeclaIncorrecta(tecla) {
  tecla.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(4px)' },
      { transform: 'translateX(0)' }
    ],
    { duration: 250, easing: 'ease-in-out' }
  );
}
