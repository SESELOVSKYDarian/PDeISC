// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 6;
  const metodo = "slice";
  const categoria = "no mutador";
  const casos = [];

  // Caso 1: slice.
  casos.push({"consigna": "Copia los primeros 3 elementos de un array de numeros.", "arrayInicial": [1, 2, 3, 4, 5], "operacion": "numeros.slice(0, 3)", "resultadoFinal": [1, 2, 3], "explicacion": "slice devuelve copia parcial sin tocar el original."});

  // Caso 2: slice.
  casos.push({"consigna": "Crea una copia parcial de un array de peliculas desde la posicion 2 hasta la 4.", "arrayInicial": ["A", "B", "C", "D", "E"], "operacion": "peliculas.slice(2, 5)", "resultadoFinal": ["C", "D", "E"], "explicacion": "Se toma desde indice inicial hasta fin no incluido."});

  // Caso 3: slice.
  casos.push({"consigna": "Crea un array nuevo con los ultimos 3 elementos sin modificarlos.", "arrayInicial": [10, 20, 30, 40, 50], "operacion": "numeros.slice(-3)", "resultadoFinal": [30, 40, 50], "explicacion": "Los indices negativos cuentan desde el final."});

  return { id, metodo, categoria, casos };
}

export default { getData };
