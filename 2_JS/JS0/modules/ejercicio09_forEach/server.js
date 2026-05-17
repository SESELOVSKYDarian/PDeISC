// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 9;
  const metodo = "forEach";
  const categoria = "iteracion";
  const casos = [];

  // Caso 1: forEach.
  casos.push({"consigna": "Muestra todos los nombres de un array con un saludo.", "arrayInicial": ["Ana", "Luis"], "operacion": "forEach para crear saludos", "resultadoFinal": ["Hola Ana", "Hola Luis"], "explicacion": "forEach recorre cada elemento sin crear array automaticamente."});

  // Caso 2: forEach.
  casos.push({"consigna": "Imprime el doble de cada numero de un array con forEach()", "arrayInicial": [2, 4, 6], "operacion": "forEach y push de dobles", "resultadoFinal": [4, 8, 12], "explicacion": "Se usa acumulador externo para guardar resultados."});

  // Caso 3: forEach.
  casos.push({"consigna": "Dado un array de objetos {nombre, edad}, muestra cada nombre con su edad.", "arrayInicial": [{"nombre": "Ana", "edad": 20}, {"nombre": "Leo", "edad": 25}], "operacion": "forEach formateando texto", "resultadoFinal": ["Ana tiene 20 anos", "Leo tiene 25 anos"], "explicacion": "forEach es util para side effects o formateos."});

  return { id, metodo, categoria, casos };
}

export default { getData };
