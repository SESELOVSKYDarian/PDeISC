import { USERS_URL, VALIDATION_URL } from "../constants.js";

export async function validateOnBackend(payload) {
  // valido tambien del lado del servidor
  const response = await fetch(VALIDATION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(Object.values(data.errors).join(" "));
  }

  return data.user;
}

export async function getUsersWithFetch() {
  // traigo usuarios para comparar con fetch
  const response = await fetch(USERS_URL);

  if (!response.ok) {
    throw new Error("No se pudo consultar la API para validar el usuario.");
  }

  return response.json();
}

export async function getUsersWithAxios() {
  // traigo usuarios para comparar con axios
  const response = await axios.get(USERS_URL);
  return response.data;
}

export async function submitWithFetch(payload) {
  // hago el post con fetch
  const response = await fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("La API no acepto el envio con fetch.");
  }

  return response.json();
}

export async function submitWithAxios(payload) {
  // hago el post con axios
  const response = await axios.post(USERS_URL, payload);
  return response.data;
}
