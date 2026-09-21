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

// ingreso con redes: 1) pido la dirección del proveedor, 2) al volver canjeo el código por la sesión
export async function oauthUrlRequest(provider) {
  const { data } = await api.post("/auth/oauth/url", { provider });
  return data.url;
}

export async function oauthCallbackRequest(values) {
  const { data } = await api.post("/auth/oauth/callback", values);
  return data.user;
}
