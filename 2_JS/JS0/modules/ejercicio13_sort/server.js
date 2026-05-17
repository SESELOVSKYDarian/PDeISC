// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 13;
  const metodo = "sort";
  const categoria = "transformacion";
  const casos = [];

  // Caso 1: sort.
  casos.push({"consigna": "Ordena un array de numeros de menor a mayor.", "arrayInicial": [40, 5, 100, 2], "operacion": "numeros.sort((a, b) => a - b)", "resultadoFinal": [2, 5, 40, 100], "explicacion": "Con comparador numerico se evita orden lexicografico."});

  // Caso 2: sort.
  casos.push({"consigna": "Ordena un array de palabras alfabeticamente.", "arrayInicial": ["pera", "banana", "manzana"], "operacion": "palabras.sort()", "resultadoFinal": ["banana", "manzana", "pera"], "explicacion": "sort sin comparador funciona bien para texto simple."});

  // Caso 3: sort.
  casos.push({"consigna": "Dado un array de objetos {nombre, edad}, ordenalos por edad.", "arrayInicial": [{"nombre": "Ana", "edad": 30}, {"nombre": "Luis", "edad": 22}], "operacion": "personas.sort((a, b) => a.edad - b.edad)", "resultadoFinal": [{"nombre": "Luis", "edad": 22}, {"nombre": "Ana", "edad": 30}], "explicacion": "Se compara por la propiedad edad."});

  return { id, metodo, categoria, casos };
}

export default { getData };
