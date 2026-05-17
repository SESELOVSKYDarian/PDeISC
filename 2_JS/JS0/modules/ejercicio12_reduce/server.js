// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 12;
  const metodo = "reduce";
  const categoria = "transformacion";
  const casos = [];

  // Caso 1: reduce.
  casos.push({"consigna": "Suma todos los elementos de un array.", "arrayInicial": [1, 2, 3, 4], "operacion": "numeros.reduce((acc, n) => acc + n, 0)", "resultadoFinal": 10, "explicacion": "reduce acumula en un unico valor."});

  // Caso 2: reduce.
  casos.push({"consigna": "Multiplica todos los elementos de un array de enteros.", "arrayInicial": [2, 3, 4], "operacion": "numeros.reduce((acc, n) => acc * n, 1)", "resultadoFinal": 24, "explicacion": "El acumulador arranca en 1 para producto."});

  // Caso 3: reduce.
  casos.push({"consigna": "Dado un array de objetos {precio}, obtiene el total de precios.", "arrayInicial": [{"precio": 10}, {"precio": 25.5}, {"precio": 4.5}], "operacion": "items.reduce((acc, i) => acc + i.precio, 0)", "resultadoFinal": 40.0, "explicacion": "Se suma una propiedad de cada objeto."});

  return { id, metodo, categoria, casos };
}

export default { getData };
