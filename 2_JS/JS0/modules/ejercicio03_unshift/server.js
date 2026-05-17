// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 3;
  const metodo = "unshift";
  const categoria = "mutador";
  const casos = [];

  // Caso 1: unshift.
  casos.push({"consigna": "Agrega tres colores al principio de un array vacio.", "arrayInicial": [], "operacion": "colores.unshift(\"rojo\", \"verde\", \"azul\")", "resultadoFinal": ["rojo", "verde", "azul"], "explicacion": "unshift inserta al inicio y devuelve nueva longitud."});

  // Caso 2: unshift.
  casos.push({"consigna": "Dado un array de tareas, agrega una nueva tarea urgente al principio.", "arrayInicial": ["estudiar", "ordenar"], "operacion": "tareas.unshift(\"URGENTE: pagar factura\")", "resultadoFinal": ["URGENTE: pagar factura", "estudiar", "ordenar"], "explicacion": "La tarea urgente pasa al primer lugar."});

  // Caso 3: unshift.
  casos.push({"consigna": "Inserta el nombre de un usuario al principio de un array de usuarios conectados.", "arrayInicial": ["Marina", "Leo"], "operacion": "usuarios.unshift(\"Admin\")", "resultadoFinal": ["Admin", "Marina", "Leo"], "explicacion": "El nuevo usuario queda primero en la cola visual."});

  return { id, metodo, categoria, casos };
}

export default { getData };
