// sube un archivo txt real al backend
export async function subirArchivo(archivo) {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const respuesta = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });
  return respuesta.json();
}

// pide al backend que filtre el array de numeros
export async function filtrarEnServidor(numeros) {
  const respuesta = await fetch("/api/filtrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numeros })
  });
  return respuesta.json();
}

// obtiene todos los txt disponibles
export async function obtenerArchivos() {
  const respuesta = await fetch("/api/archivos");
  return respuesta.json();
}

// lee un txt del servidor
export async function leerArchivo(nombre) {
  const respuesta = await fetch(`/api/archivos/${encodeURIComponent(nombre)}`);
  return respuesta.json();
}

// edita el contenido de un txt
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
