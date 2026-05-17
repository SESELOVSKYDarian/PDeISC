// Decodifica texto invirtiendo solo los segmentos entre parentesis.
export function decodificarSecreto(texto) {
  return texto.replace(/\(([^()]*)\)/g, (_, bloque) => {
    return bloque.split("").reverse().join("");
  }).replace(/\s+/g, " ").trim();
}

// Devuelve el ejercicio secreto para la API.
export function getData() {
  const id = 15;
  const metodo = "secreto";
  const categoria = "especial";
  const entrada = "Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo.";
  const salida = decodificarSecreto(entrada);

  const casos = [
    {
      consigna: "Invertir solo los textos entre parentesis y quitar parentesis.",
      arrayInicial: [entrada],
      operacion: "replace + reverse por cada bloque entre parentesis",
      resultadoFinal: [salida],
      explicacion: "Cada bloque entre parentesis se invierte de forma independiente."
    }
  ];

  return { id, metodo, categoria, casos, entrada, salida };
}

export default { getData, decodificarSecreto };
