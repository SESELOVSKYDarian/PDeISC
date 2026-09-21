import { sendOAuthError } from "../../oauth/oauthError.js";
import { getProvider } from "../../oauth/providers/index.js";
import { redirectUri } from "../../oauth/redirectUri.js";
import { startState } from "../../oauth/state.js";

// paso 1: le devuelvo al cliente la dirección del proveedor a la que tiene que ir
export function oauthUrl(req, res, next) {
  try {
    const provider = getProvider(req.body.provider);
    const state = startState(res, provider.name);
    res.json({ url: provider.buildUrl(state, redirectUri(provider.name)) });
  } catch (error) {
    sendOAuthError(error, res, next);
  }
}
