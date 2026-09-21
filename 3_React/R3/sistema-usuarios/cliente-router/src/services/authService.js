import { api } from "./api";

// cada función devuelve directamente el usuario (o nada)
export async function sessionRequest() {
  const { data } = await api.post("/auth/sesion");
  return data.user;
}

export async function loginRequest(values) {
  const { data } = await api.post("/auth/login", values);
  return data.user;
}

export async function registerRequest(values) {
  const { data } = await api.post("/auth/registro", values);
  return data.user;
}

export async function updateProfileRequest(values) {
  const { data } = await api.post("/auth/perfil", values);
  return data.user;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}
