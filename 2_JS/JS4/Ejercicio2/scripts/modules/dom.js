export function getFields(prefix) {
  return {
    name: document.querySelector(`#${prefix}-name`),
    email: document.querySelector(`#${prefix}-email`),
    nameError: document.querySelector(`#${prefix}-name-error`),
    emailError: document.querySelector(`#${prefix}-email-error`),
    clearButton: document.querySelector(`#${prefix}-clear`)
  };
}

export function showStatus(element, message, type) {
  element.className = `status-box status-box--${type}`;
  element.innerHTML = message;
}

export function paintField(input, errorElement, message) {
  // marco visualmente si ese campo quedo bien o mal
  input.classList.toggle("is-invalid", Boolean(message));
  input.classList.toggle("is-valid", !message && input.value.trim() !== "");
  errorElement.textContent = message;
}

export function paintErrors(prefix, errors = {}) {
  // pinto solo los errores que necesito en ese momento
  const fields = getFields(prefix);
  paintField(fields.name, fields.nameError, errors.name || "");
  paintField(fields.email, fields.emailError, errors.email || "");
}

export function clearFieldState(prefix) {
  // limpio los mensajes y los bordes
  const fields = getFields(prefix);
  paintField(fields.name, fields.nameError, "");
  paintField(fields.email, fields.emailError, "");
}
