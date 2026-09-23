import axios from "axios";

// "/api" lo reenvía el servidor de Vite a la API (ver vite.config.js); la cookie de sesión viaja sola
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// saca el mensaje que mandó el servidor, o uno genérico
export const getMessage = (error) => error.response?.data?.message || "No se pudo completar la operación.";
