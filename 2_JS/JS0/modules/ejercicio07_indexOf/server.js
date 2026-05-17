// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 7;
  const metodo = "indexOf";
  const categoria = "busqueda";
  const casos = [];

  // Caso 1: indexOf.
  casos.push({"consigna": "Encuentra la posicion de la palabra \"perro\" en un array.", "arrayInicial": ["gato", "perro", "pez"], "operacion": "animales.indexOf(\"perro\")", "resultadoFinal": 1, "explicacion": "Devuelve el indice donde aparece por primera vez."});

  // Caso 2: indexOf.
  casos.push({"consigna": "Verifica si el numero 50 esta en un array y en que posicion.", "arrayInicial": [10, 50, 90], "operacion": "numeros.indexOf(50)", "resultadoFinal": 1, "explicacion": "Si no existe devuelve -1."});

  // Caso 3: indexOf.
  casos.push({"consigna": "Dado un array de ciudades, muestra el indice de \"Madrid\" o un mensaje si no esta.", "arrayInicial": ["Lima", "Bogota", "Quito"], "operacion": "ciudades.indexOf(\"Madrid\")", "resultadoFinal": "Madrid no esta en el array", "explicacion": "Se evalua -1 para mostrar mensaje claro."});

  return { id, metodo, categoria, casos };
}

export default { getData };
