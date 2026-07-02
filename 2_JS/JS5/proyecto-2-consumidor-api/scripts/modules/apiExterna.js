const API_URL = "http://localhost:3000/api/alumnos/listar";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.mensaje || "No se pudo conectar con el Proyecto 1");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function obtenerAlumnosExterna() {
  return requestJson(API_URL, {
    method: "POST",
    body: JSON.stringify({})
  });
}

