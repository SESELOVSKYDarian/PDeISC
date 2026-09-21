// redes con las que se puede ingresar (el id es el mismo que usa la API)
export const oauthProviders = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
  { id: "discord", label: "Discord" },
];

export const findProvider = (id) => oauthProviders.find((provider) => provider.id === id);
