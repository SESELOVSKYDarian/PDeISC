import { listProviders } from "../../oauth/providers/index.js";

// devuelve la lista de redes con su estado (habilitada o no); nunca expone las claves
export function oauthProviders(_req, res) {
  res.json({ providers: listProviders() });
}
