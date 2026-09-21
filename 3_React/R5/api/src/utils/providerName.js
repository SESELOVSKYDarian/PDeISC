import { validateName } from "../validators/nameValidator.js";

const notLetters = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g;

const onlyLetters = (text) => String(text || "").replace(notLetters, " ").replace(/\s+/g, " ").trim().slice(0, 80).trim();

// el nombre de la red puede traer números o símbolos: lo dejo con las reglas del sistema (solo letras)
export function cleanProviderName(name, email) {
  for (const candidate of [name, email.split("@")[0]]) {
    const clean = onlyLetters(candidate);
    if (!validateName(clean)) return clean;
  }
  return "Usuario";
}
