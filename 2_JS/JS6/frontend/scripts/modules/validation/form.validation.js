// helper generico para pintar errores debajo de cada campo, en tiempo real
export function mostrarErrorCampo(inputEl, mensaje) {
  const campo = inputEl.closest('.campo');
  if (!campo) return;

  const elementoError = campo.querySelector('.campo__mensaje-error');
  inputEl.classList.toggle('campo__control--error', Boolean(mensaje));
  inputEl.setAttribute('aria-invalid', mensaje ? 'true' : 'false');

  if (elementoError) {
    elementoError.textContent = mensaje || '';
  }
}

export function limpiarErroresFormulario(formulario) {
  formulario.querySelectorAll('.campo__mensaje-error').forEach(el => (el.textContent = ''));
  formulario.querySelectorAll('.campo__control--error').forEach(el => el.classList.remove('campo__control--error'));
}
