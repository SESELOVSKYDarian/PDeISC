// revisa si un numero empieza y termina con el mismo digito
export function obtenerDigitos(numero) {
  const texto = String(Math.abs(numero)).replace(".", "");
  return texto;
}

// revisa si el numero tiene un solo digito
export function esUnDigito(numero) {
  return obtenerDigitos(numero).length === 1;
}

// identifica si el numero es resultado de un factorial (version simplificada para UI)
function esFactorial(numero) {
  if (!Number.isInteger(numero) || numero < 1) return false;
  if (numero === 1) return true;
  let acumulado = 1;
  for (let n = 2; acumulado <= numero; n++) {
    acumulado *= n;
    if (acumulado === numero) return true;
  }
  return false;
}

// revisa si un numero empieza y termina con el mismo digito
export function esUtil(numero) {
  const texto = obtenerDigitos(numero);
  if (texto.length === 1) return false;

  return texto[0] === texto[texto.length - 1];
}

// muestra el proceso localmente sin reemplazar el filtrado del backend
export function describirProceso(numeros) {
  return numeros.map((numero) => {
    let motivo = "";
    if (esUnDigito(numero)) motivo = "no cumple: un solo digito";
    else if (!esUtil(numero)) {
      if (esFactorial(numero)) motivo = "no cumple: factorial sin coincidencia de digitos";
      else motivo = "no cumple: inicio/fin distintos";
    } else {
      motivo = "cumple";
    }

    return {
      numero,
      estado: motivo === "cumple" ? "cumple" : "no cumple"
    };
  });
}
