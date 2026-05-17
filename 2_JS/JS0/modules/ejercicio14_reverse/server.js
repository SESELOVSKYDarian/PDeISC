// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 14;
  const metodo = "reverse";
  const categoria = "mutador";
  const casos = [];

  // Caso 1: reverse.
  casos.push({"consigna": "Invierte un array de letras.", "arrayInicial": ["a", "b", "c"], "operacion": "letras.reverse()", "resultadoFinal": ["c", "b", "a"], "explicacion": "reverse invierte el orden del mismo array."});

  // Caso 2: reverse.
  casos.push({"consigna": "Invierte el orden de un array de numeros.", "arrayInicial": [1, 2, 3, 4], "operacion": "numeros.reverse()", "resultadoFinal": [4, 3, 2, 1], "explicacion": "La operacion es in-place."});

  // Caso 3: reverse.
  casos.push({"consigna": "Dado un string, conviertelo en array y revierte el texto.", "arrayInicial": "Hola mundo", "operacion": "texto.split('').reverse().join('')", "resultadoFinal": "odnum aloH", "explicacion": "Se transforma a array temporal para invertir caracteres."});

  return { id, metodo, categoria, casos };
}

export default { getData };
