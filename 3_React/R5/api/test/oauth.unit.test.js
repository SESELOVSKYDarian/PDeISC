// pruebas sin base de datos: nombre, state y URLs de autorización
import test from "node:test";
import assert from "node:assert/strict";

process.env.GOOGLE_CLIENT_ID = "gid";
process.env.GOOGLE_CLIENT_SECRET = "gsec";
process.env.GITHUB_CLIENT_ID = "hid";
process.env.GITHUB_CLIENT_SECRET = "hsec";
process.env.DISCORD_CLIENT_ID = "did";
process.env.DISCORD_CLIENT_SECRET = "dsec";
process.env.JWT_SECRET = "secreto-de-prueba";
process.env.DB_HOST = "127.0.0.1";
process.env.DB_USER = "root";
process.env.DB_NAME = "r5";

const { cleanProviderName } = await import("../src/utils/providerName.js");
const { getProvider } = await import("../src/oauth/providers/index.js");
const { startState, checkState } = await import("../src/oauth/state.js");
const { redirectUri } = await import("../src/oauth/redirectUri.js");

// res falso que guarda las cookies que la API pone
const fakeRes = () => ({ cookies: {}, cookie(name, value) { this.cookies[name] = value; }, clearCookie(name) { delete this.cookies[name]; } });

test("el nombre de la red queda solo con letras y espacios", () => {
  assert.equal(cleanProviderName("Luis 2000 Gómez", "luis@x.com"), "Luis Gómez");
  assert.equal(cleanProviderName("  Ana   María ", "ana@x.com"), "Ana María");
  assert.equal(cleanProviderName("1234", "camila.perez@x.com"), "camila perez");
  assert.equal(cleanProviderName("", "1234@x.com"), "Usuario");
});

test("cada proveedor arma su URL con state y la URL de retorno del cliente", () => {
  for (const [name, host] of [["google", "accounts.google.com"], ["github", "github.com"], ["discord", "discord.com"]]) {
    const url = new URL(getProvider(name).buildUrl("estado123", redirectUri(name)));
    assert.equal(url.host, host);
    assert.equal(url.searchParams.get("state"), "estado123");
    assert.equal(url.searchParams.get("redirect_uri"), `http://localhost:5175/auth/${name}/callback`);
  }
});

test("un proveedor inexistente se rechaza", () => {
  assert.throws(() => getProvider("meta"), /no válido/);
  assert.throws(() => getProvider("__proto__"), /no válido/);
  assert.throws(() => getProvider(undefined), /no válido/);
});

test("el state vuelve igual solo si coincide con la cookie y se usa una vez", () => {
  const res = fakeRes();
  const state = startState(res, "google");
  const req = { cookies: { oauth_state: res.cookies.oauth_state } };

  assert.doesNotThrow(() => checkState(req, fakeRes(), "google", state));
  assert.throws(() => checkState(req, fakeRes(), "google", "otro-state"), /seguridad/);
  assert.throws(() => checkState(req, fakeRes(), "github", state), /seguridad/);
  assert.throws(() => checkState({ cookies: {} }, fakeRes(), "google", state), /seguridad/);
});
