// valida que el archivo elegido sea txt
export function validarArchivoTxt(archivo) {
  return archivo && archivo.name.toLowerCase().endsWith(".txt") && (archivo.type === "text/plain" || archivo.type === "");
}

// marca visualmente un campo segun su validez
export function marcarCampo(campo, esValido) {
  campo.classList.toggle("is-valid", esValido);
  campo.classList.toggle("is-invalid", !esValido);
}
