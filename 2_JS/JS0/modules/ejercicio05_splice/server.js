// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 5;
  const metodo = "splice";
  const categoria = "mutador";
  const casos = [];

  // Caso 1: splice.
  casos.push({"consigna": "Elimina dos elementos desde la posicion 1 de un array de letras.", "arrayInicial": ["a", "b", "c", "d"], "operacion": "letras.splice(1, 2)", "resultadoFinal": {"eliminados": ["b", "c"], "array": ["a", "d"]}, "explicacion": "splice modifica el array original y devuelve los eliminados."});

  // Caso 2: splice.
  casos.push({"consigna": "Inserta un nuevo nombre en la segunda posicion sin eliminar nada.", "arrayInicial": ["Ana", "Luis"], "operacion": "nombres.splice(1, 0, \"Carlos\")", "resultadoFinal": ["Ana", "Carlos", "Luis"], "explicacion": "Con deleteCount en 0 solo inserta."});

  // Caso 3: splice.
  casos.push({"consigna": "Reemplaza dos elementos por otros nuevos desde una posicion determinada.", "arrayInicial": ["x", "y", "z", "w"], "operacion": "arr.splice(1, 2, \"m\", \"n\")", "resultadoFinal": ["x", "m", "n", "w"], "explicacion": "Se reemplaza parte del array en una sola llamada."});

  return { id, metodo, categoria, casos };
}

export default { getData };
