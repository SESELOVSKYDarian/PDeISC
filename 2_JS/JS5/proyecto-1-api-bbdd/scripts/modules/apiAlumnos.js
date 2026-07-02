const JSON_HEADERS = {
  "Content-Type": "application/json"
};

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.mensaje || "La operación no se pudo completar");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function listarAlumnos() {
  return requestJson("/api/alumnos/listar", {
    method: "POST",
    body: JSON.stringify({})
  });
}

export function crearAlumno(datos) {
  return requestJson("/api/alumnos/crear", {
    method: "POST",
    body: JSON.stringify(datos)
  });
}

export function editarAlumno(id, datos) {
  return requestJson(`/api/alumnos/${id}`, {
    method: "PUT",
    body: JSON.stringify(datos)
  });
}

export function eliminarAlumno(id) {
  return requestJson(`/api/alumnos/${id}`, {
    method: "DELETE"
  });
}

export function solicitarJsonAlumnos() {
  return listarAlumnos();
}

