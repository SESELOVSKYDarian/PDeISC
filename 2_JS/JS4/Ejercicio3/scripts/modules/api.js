const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export async function getUsersWithFetch() {
  const response = await fetch(USERS_URL);

  if (!response.ok) {
    throw new Error("No se pudieron cargar los usuarios con fetch.");
  }

  return response.json();
}

export async function getUsersWithAxios() {
  const response = await axios.get(USERS_URL);
  return response.data;
}
