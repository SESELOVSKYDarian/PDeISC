/**
 * @module constants
 * @description Expresiones regulares de validación frontend para la Consigna 6.
 */

/** Acepta solo letras (unicode) y espacios. Sin números ni símbolos. */
export const NAME_REGEX = /^[\p{L}\s]+$/u;

/** Requiere arroba y dominio terminado en .com */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.com$/i;
