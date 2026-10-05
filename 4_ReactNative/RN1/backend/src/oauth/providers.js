import { config } from "../config.js";
import { getJson, postForm } from "./http.js";

const FB_VERSION = "v25.0";
const { google: g, discord: d, facebook: f } = config.oauth;

// cada proveedor sabe armar su URL y traer el perfil con el código
export const providers = {
  google: {
    label: "Google",
    disponible: () => Boolean(g.clientId && g.clientSecret),
    url: (state, redirectUri) =>
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: g.clientId, redirect_uri: redirectUri, response_type: "code",
        scope: "openid email profile", prompt: "select_account", state,
      }),
    async perfil(code, redirectUri) {
      const token = await postForm("https://oauth2.googleapis.com/token", {
        client_id: g.clientId, client_secret: g.clientSecret, redirect_uri: redirectUri,
        grant_type: "authorization_code", code,
      });
      const info = await getJson("https://openidconnect.googleapis.com/v1/userinfo", token.access_token);
      return { uid: info.sub, nombre: info.name, email: info.email, verificado: info.email_verified === true };
    },
  },

  discord: {
    label: "Discord",
    disponible: () => Boolean(d.clientId && d.clientSecret),
    url: (state, redirectUri) =>
      "https://discord.com/oauth2/authorize?" +
      new URLSearchParams({
        client_id: d.clientId, redirect_uri: redirectUri, response_type: "code",
        scope: "identify email", prompt: "consent", state,
      }),
    async perfil(code, redirectUri) {
      const headers = { "User-Agent": "DiscordBot (depaso, 1.0)" };
      const token = await postForm("https://discord.com/api/oauth2/token", {
        client_id: d.clientId, client_secret: d.clientSecret, redirect_uri: redirectUri,
        grant_type: "authorization_code", code,
      }, headers);
      const info = await getJson("https://discord.com/api/users/@me", token.access_token, headers);
      return {
        uid: String(info.id), nombre: info.global_name || info.username, email: info.email,
        verificado: info.verified === true && Boolean(info.email),
      };
    },
  },

  // Facebook Login es el inicio de sesión de Meta
  facebook: {
    label: "Meta",
    disponible: () => Boolean(f.clientId && f.clientSecret),
    url: (state, redirectUri) =>
      `https://www.facebook.com/${FB_VERSION}/dialog/oauth?` +
      new URLSearchParams({
        client_id: f.clientId, redirect_uri: redirectUri, response_type: "code",
        scope: "email,public_profile", state,
      }),
    async perfil(code, redirectUri) {
      const params = new URLSearchParams({
        client_id: f.clientId, client_secret: f.clientSecret, redirect_uri: redirectUri, code,
      });
      const token = await getJson(`https://graph.facebook.com/${FB_VERSION}/oauth/access_token?${params}`);
      const info = await getJson(`https://graph.facebook.com/${FB_VERSION}/me?fields=id,name,email`, token.access_token);
      return { uid: String(info.id), nombre: info.name, email: info.email, verificado: Boolean(info.email) };
    },
  },
};

export const redirectUri = (nombre, base) => `${base}/auth/${nombre}/callback`;
