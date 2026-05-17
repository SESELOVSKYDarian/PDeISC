// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 8;
  const metodo = "includes";
  const categoria = "busqueda";
  const casos = [];

  // Caso 1: includes.
  casos.push({"consigna": "Comprueba si un array contiene la palabra \"admin\".", "arrayInicial": ["user", "admin", "guest"], "operacion": "roles.includes(\"admin\")", "resultadoFinal": true, "explicacion": "includes retorna true si existe el valor."});

  // Caso 2: includes.
  casos.push({"consigna": "Dado un array de colores, indica si existe \"verde\".", "arrayInicial": ["rojo", "azul"], "operacion": "colores.includes(\"verde\")", "resultadoFinal": false, "explicacion": "El metodo devuelve booleano simple."});

  // Caso 3: includes.
  casos.push({"consigna": "Verifica si un numero esta presente antes de sumarlo al array.", "arrayInicial": [3, 6, 9], "operacion": "si no incluye 12, push(12)", "resultadoFinal": [3, 6, 9, 12], "explicacion": "Se evita duplicar valores cuando ya existe."});

  return { id, metodo, categoria, casos };
}

export default { getData };
