// saca números y símbolos mientras el usuario escribe un nombre
export function onlyLetters(event) {
  event.currentTarget.value = event.currentTarget.value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g, "");
}
