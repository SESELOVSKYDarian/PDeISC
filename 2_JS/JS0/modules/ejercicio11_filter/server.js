// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 11;
  const metodo = "filter";
  const categoria = "transformacion";
  const casos = [];

  // Caso 1: filter.
  casos.push({"consigna": "Filtra los numeros mayores a 10 de un array.", "arrayInicial": [4, 11, 20, 8], "operacion": "numeros.filter(n => n > 10)", "resultadoFinal": [11, 20], "explicacion": "filter conserva solo los que cumplen condicion."});

  // Caso 2: filter.
  casos.push({"consigna": "Dado un array de palabras, filtra las que tengan mas de 5 letras.", "arrayInicial": ["sol", "montana", "casa", "escuela"], "operacion": "palabras.filter(p => p.length > 5)", "resultadoFinal": ["montana", "escuela"], "explicacion": "La condicion se evalua una por una."});

  // Caso 3: filter.
  casos.push({"consigna": "Filtra los usuarios activos de un array de objetos {nombre, activo}.", "arrayInicial": [{"nombre": "Ana", "activo": true}, {"nombre": "Luis", "activo": false}], "operacion": "usuarios.filter(u => u.activo)", "resultadoFinal": [{"nombre": "Ana", "activo": true}], "explicacion": "Se retorna un subarray con los activos."});

  return { id, metodo, categoria, casos };
}

export default { getData };
