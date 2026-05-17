// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 10;
  const metodo = "map";
  const categoria = "transformacion";
  const casos = [];

  // Caso 1: map.
  casos.push({"consigna": "Crea un nuevo array con cada numero multiplicado por 3.", "arrayInicial": [1, 2, 3], "operacion": "numeros.map(n => n * 3)", "resultadoFinal": [3, 6, 9], "explicacion": "map crea un nuevo array transformado."});

  // Caso 2: map.
  casos.push({"consigna": "Convierte un array de nombres en mayusculas.", "arrayInicial": ["ana", "leo"], "operacion": "nombres.map(n => n.toUpperCase())", "resultadoFinal": ["ANA", "LEO"], "explicacion": "El original no se modifica."});

  // Caso 3: map.
  casos.push({"consigna": "A un array de precios, agregale el 21% de IVA y crea un nuevo array.", "arrayInicial": [100, 200], "operacion": "precios.map(p => +(p * 1.21).toFixed(2))", "resultadoFinal": [121.0, 242.0], "explicacion": "Se aplica IVA en cada posicion y se retorna nuevo array."});

  return { id, metodo, categoria, casos };
}

export default { getData };
