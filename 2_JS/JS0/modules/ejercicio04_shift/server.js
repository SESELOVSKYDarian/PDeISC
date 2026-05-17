// Resuelve el ejercicio y devuelve datos listos para la API.
export function getData() {
  const id = 4;
  const metodo = "shift";
  const categoria = "mutador";
  const casos = [];

  // Caso 1: shift.
  casos.push({"consigna": "Quita el primer numero de un array de enteros.", "arrayInicial": [10, 20, 30], "operacion": "numeros.shift()", "resultadoFinal": {"eliminado": 10, "array": [20, 30]}, "explicacion": "shift elimina el primer elemento."});

  // Caso 2: shift.
  casos.push({"consigna": "Elimina el primer mensaje de un array de mensajes de chat.", "arrayInicial": ["hola", "todo bien", "chau"], "operacion": "mensajes.shift()", "resultadoFinal": {"eliminado": "hola", "array": ["todo bien", "chau"]}, "explicacion": "Se procesa primero el mensaje mas antiguo."});

  // Caso 3: shift.
  casos.push({"consigna": "Usa shift() para simular una cola de atencion al cliente.", "arrayInicial": ["Cliente A", "Cliente B", "Cliente C"], "operacion": "atendidos con shift en bucle", "resultadoFinal": ["Cliente A", "Cliente B", "Cliente C"], "explicacion": "La cola respeta el orden de llegada (FIFO)."});

  return { id, metodo, categoria, casos };
}

export default { getData };
