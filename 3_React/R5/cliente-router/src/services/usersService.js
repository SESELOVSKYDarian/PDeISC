import { api } from "./api";

export async function listUsersRequest(search = "") {
  const { data } = await api.post("/usuarios/listar", { search });
  return data.users;
}

export const createUserRequest = (values) => api.post("/usuarios/crear", values);

export const updateUserRequest = (values) => api.post("/usuarios/actualizar", values);

export const deleteUserRequest = (id) => api.post("/usuarios/eliminar", { id });
