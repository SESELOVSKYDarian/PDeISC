// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 2;
  const metodo = "pop";
  const categoria = "mutador";
  const casos = [];

  // Caso 1: pop.
  casos.push({"consigna": "Elimina el ultimo elemento de un array de animales.", "arrayInicial": ["gato", "perro", "loro"], "operacion": "animales.pop()", "resultadoFinal": {"eliminado": "loro", "array": ["gato", "perro"]}, "explicacion": "pop quita y devuelve el ultimo elemento."});

  // Caso 2: pop.
  casos.push({"consigna": "Quita el ultimo producto de una lista de compras y muestra cual fue eliminado.", "arrayInicial": ["pan", "leche", "huevos"], "operacion": "compras.pop()", "resultadoFinal": {"eliminado": "huevos", "array": ["pan", "leche"]}, "explicacion": "Se informa el producto eliminado."});

  // Caso 3: pop.
  casos.push({"consigna": "Usa un bucle while para vaciar un array con pop().", "arrayInicial": [1, 2, 3], "operacion": "while(arr.length) arr.pop()", "resultadoFinal": [], "explicacion": "El bucle elimina el ultimo elemento hasta dejarlo vacio."});

  return { id, metodo, categoria, casos };
}

export default { getData };
