const API_URL = "/api/alumnos";

export async function getStudentsWithFetch() {
  // llamo a la api propia con fetch
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de alumnos con fetch.");
  }

  return response.json();
}

export async function getStudentsWithAxios() {
  // llamo a la api propia con axios
  const response = await axios.get(API_URL);
  return response.data;
}
