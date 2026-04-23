// deja pasar letras y espacios nada mas
export const NAME_REGEX = /^[\p{L}\s]+$/u;

// pido que tenga @ y termine en .com
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.com$/i;
