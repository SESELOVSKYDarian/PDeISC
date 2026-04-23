// saco todas las marcas de error visual
export function clearErrors(form) {
  form.querySelectorAll('.is-invalid').forEach((field) => field.classList.remove('is-invalid'));
  form.querySelectorAll('[data-error-for]').forEach((node) => { node.textContent = ''; });
}

// marco el campo y dejo el mensaje abajo
export function markInvalid(form, name, message) {
  form.querySelectorAll(`[name="${name}"]`).forEach((field) => field.classList.add('is-invalid'));
  const errorTarget = form.querySelector(`[data-error-for="${name}"]`);
  if (errorTarget) errorTarget.textContent = message;
}

// limpio el error de un campo puntual
export function clearFieldError(form, name) {
  form.querySelectorAll(`[name="${name}"]`).forEach((field) => field.classList.remove('is-invalid'));
  const errorTarget = form.querySelector(`[data-error-for="${name}"]`);
  if (errorTarget) errorTarget.textContent = '';
}

// aca muestro el resultado final abajo del form
export function renderResult(result, title, body, alertClass) {
  result.innerHTML = `
    <div class="card-body">
      <h2 class="h4 mb-3" style="font-family:'Montserrat',sans-serif;font-weight:700">${title}</h2>
      <div class="alert ${alertClass} mb-0">${body}</div>
    </div>
  `;
}

// armo la tarjeta linda cuando sale bien
export function buildSuccessMarkup(data, message, emailStatus) {
  const initials = `${data.nombre[0]}${data.apellido[0]}`.toUpperCase();
  const chips = data.intereses.map((i) => `<span class="result-chip">${i}</span>`).join(' ');

  return `
    <div class="result-profile">
      <div class="result-avatar">${initials}</div>
      <div>
        <div class="result-field">
          <span class="result-field-label">Nombre</span>
          <span class="result-field-value">${data.nombre} ${data.apellido}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Email</span>
          <span class="result-field-value">${data.email}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Edad</span>
          <span class="result-field-value">${data.edad} años</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Género</span>
          <span class="result-field-value">${data.genero}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">País</span>
          <span class="result-field-value">${data.pais}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">Intereses</span>
          <span>${chips}</span>
        </div>
        <div class="result-field mt-2">
          <span class="result-field-label">Backend</span>
          <span class="result-field-value" style="font-size:0.8rem;color:var(--c-muted)">${message}</span>
        </div>
        <div class="result-field">
          <span class="result-field-label">SMTP</span>
          <span class="result-field-value" style="font-size:0.8rem;color:var(--c-muted)">${emailStatus}</span>
        </div>
      </div>
    </div>
  `;
}

// armo el bloque de error cuando algo falla
export function buildFailureMarkup(message, errors) {
  const items = Object.values(errors ?? {}).map((error) => `<li>${error}</li>`).join('');
  return `
    <p><strong>No se pudo completar el registro.</strong></p>
    <p>${message}</p>
    <ul class="mb-0">${items}</ul>
  `;
}
