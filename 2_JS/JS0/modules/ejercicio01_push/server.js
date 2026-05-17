// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 1;
  const metodo = "push";
  const categoria = "mutador";
  const casos = [];

  // Caso 1: push.
  casos.push({"consigna": "Crea un array vacio y agrega tres frutas usando push().", "arrayInicial": [], "operacion": "frutas.push(\"manzana\", \"banana\", \"naranja\")", "resultadoFinal": ["manzana", "banana", "naranja"], "explicacion": "push agrega al final y modifica el array."});

  // Caso 2: push.
  casos.push({"consigna": "Agrega los nombres de tus 3 amigos a un array existente llamado amigos.", "arrayInicial": ["Ana"], "operacion": "amigos.push(\"Luis\", \"Marta\", \"Pedro\")", "resultadoFinal": ["Ana", "Luis", "Marta", "Pedro"], "explicacion": "Se suman tres elementos al final en una sola operacion."});

  // Caso 3: push.
  casos.push({"consigna": "Dado un array de numeros, agrega un nuevo numero solo si es mayor que el ultimo numero.", "arrayInicial": [2, 5, 9], "operacion": "si 12 > ultimo entonces push(12)", "resultadoFinal": [2, 5, 9, 12], "explicacion": "Se valida antes de insertar para mantener orden creciente."});

  return { id, metodo, categoria, casos };
}

export default { getData };
