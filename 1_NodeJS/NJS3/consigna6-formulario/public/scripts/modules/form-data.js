// limpio espacios de mas antes de validar o mandar
export function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

// saco todos los datos del form y los dejo prolijos
export function getPayload(form) {
  const data = new FormData(form);

  return {
    nombre: normalizeText(data.get('nombre')),
    apellido: normalizeText(data.get('apellido')),
    email: normalizeText(data.get('email')).toLowerCase(),
    edad: normalizeText(data.get('edad')),
    genero: normalizeText(data.get('genero')),
    pais: normalizeText(data.get('pais')),
    intereses: data.getAll('intereses').map((value) => normalizeText(value))
  };
}
