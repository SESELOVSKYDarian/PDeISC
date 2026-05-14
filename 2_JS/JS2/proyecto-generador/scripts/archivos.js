// pide al backend la lista de txt reales
export async function obtenerArchivos() {
  const respuesta = await fetch("/api/archivos");
  return respuesta.json();
}

// guarda en el servidor un txt con los numeros cargados
export async function guardarArchivo(numeros) {
  const respuesta = await fetch("/api/archivos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numeros })
  });
  return respuesta.json();
}

// lee el contenido de un txt elegido
export async function leerArchivo(nombre) {
  const respuesta = await fetch(`/api/archivos/${encodeURIComponent(nombre)}`);
  return respuesta.json();
}

// actualiza el contenido de un txt existente
export async function editarArchivo(nombre, contenido) {
  const respuesta = await fetch(`/api/archivos/${encodeURIComponent(nombre)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenido })
  });
  return respuesta.json();
}

// elimina un archivo del servidor
export async function borrarArchivo(nombre) {
  const respuesta = await fetch(`/api/archivos/${encodeURIComponent(nombre)}`, {
    method: "DELETE"
  });
  return respuesta.json();
}
