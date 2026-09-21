// ruta principal de cada tipo de usuario
export const homePath = (user) => (user.rol === "administrador" ? "/usuarios" : "/");
