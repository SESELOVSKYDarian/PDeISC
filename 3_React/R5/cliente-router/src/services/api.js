import axios from "axios";

// la cookie de sesión viaja sola gracias a withCredentials
export const api = axios.create({
  baseURL: "http://localhost:4005/api",
  withCredentials: true,
});

// saca el mensaje que mandó el servidor, o uno genérico
export const getMessage = (error) => error.response?.data?.message || "No se pudo completar la operación.";
