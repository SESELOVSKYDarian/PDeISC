const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export async function getUsersWithFetch() {
  // hago la consulta con fetch
  const response = await fetch(USERS_URL);

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista con fetch.");
  }

  return response.json();
}

export async function getUsersWithAxios() {
  // hago la consulta con axios
  const response = await axios.get(USERS_URL);
  return response.data;
}
