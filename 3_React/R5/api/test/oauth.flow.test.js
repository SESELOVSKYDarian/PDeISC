// prueba del ingreso completo con la API real y MySQL; Google, GitHub y Discord se simulan (no hace falta internet ni claves)
// necesita MySQL prendido y la base creada (npm run seed); si no, se saltea
import test, { after } from "node:test";
import assert from "node:assert/strict";

process.env.GOOGLE_CLIENT_ID = "gid";
process.env.GOOGLE_CLIENT_SECRET = "gsec";
process.env.GITHUB_CLIENT_ID = "hid";
process.env.GITHUB_CLIENT_SECRET = "hsec";
process.env.DISCORD_CLIENT_ID = "did";
process.env.DISCORD_CLIENT_SECRET = "dsec";

const { default: app } = await import("../src/app.js");
const { pool } = await import("../src/services/db.js");

const dbReady = await pool.query("SELECT 1 FROM identidades_oauth LIMIT 1").then(() => true, () => false);
const options = { skip: dbReady ? false : "MySQL apagado o base sin crear (npm run seed)" };
const MAIL = "@oauth.test";

// fetch falso: responde lo que cada proveedor diría; lo demás (la propia API) pasa de largo
const realFetch = globalThis.fetch;
let fake = {};
globalThis.fetch = async (url, opts) => {
  const found = Object.keys(fake).find((prefix) => String(url).startsWith(prefix));
  if (!found) return realFetch(url, opts);
  return new Response(JSON.stringify(fake[found].body), { status: fake[found].status || 200, headers: { "content-type": "application/json" } });
};

const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}/api/auth`;

// cliente con su propio "navegador" de cookies
function browser() {
  const jar = {};
  return {
    jar,
    async post(path, body) {
      const cookie = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
      const res = await realFetch(base + path, { method: "POST", headers: { "Content-Type": "application/json", Cookie: cookie }, body: JSON.stringify(body) });
      for (const line of res.headers.getSetCookie()) {
        const [pair] = line.split(";");
        const [name, ...value] = pair.split("=");
        if (/Expires=Thu, 01 Jan 1970/i.test(line)) delete jar[name]; else jar[name] = value.join("=");
      }
      return { status: res.status, data: await res.json() };
    },
    // pide la URL, "vuelve" del proveedor con el code y devuelve la respuesta del callback
    async loginWith(provider, tweak = {}) {
      const { data } = await this.post("/oauth/url", { provider });
      const state = new URL(data.url).searchParams.get("state");
      return this.post("/oauth/callback", { provider, code: "abc", state: tweak.state ?? state });
    },
  };
}

const google = (sub, name, email, verified = true) => {
  fake["https://oauth2.googleapis.com/token"] = { body: { access_token: "t" } };
  fake["https://openidconnect.googleapis.com/v1/userinfo"] = { body: { sub, name, email, email_verified: verified } };
};
const github = (id, login, emails) => {
  fake["https://github.com/login/oauth/access_token"] = { body: { access_token: "t" } };
  fake["https://api.github.com/user/emails"] = { body: emails };
  fake["https://api.github.com/user"] = { body: { id, name: null, login } };
};
const discord = (id, username, email, verified = true) => {
  fake["https://discord.com/api/oauth2/token"] = { body: { access_token: "t" } };
  fake["https://discord.com/api/users/@me"] = { body: { id, username, global_name: username, email, verified } };
};

const clean = () => pool.query("DELETE FROM usuarios WHERE email LIKE ?", [`%${MAIL}`]);
if (dbReady) await clean();

test("Google: crea la cuenta con rol usuario, abre sesión y el segundo ingreso es la misma cuenta", options, async () => {
  google("g-1", "Ana Pérez", `ana${MAIL}`);
  const web = browser();
  const first = await web.loginWith("google");
  assert.equal(first.status, 200);
  assert.equal(first.data.user.rol, "usuario");
  assert.equal(first.data.user.nombre, "Ana Pérez");
  assert.ok(web.jar.session, "abre la cookie de sesión");
  assert.equal((await web.post("/sesion", {})).data.user.email, `ana${MAIL}`);

  const second = await browser().loginWith("google");
  assert.equal(second.data.user.id, first.data.user.id);
});

test("GitHub: con el mismo correo verificado se vincula a la cuenta existente", options, async () => {
  const anaId = (await browser().loginWith("google")).data.user.id;
  github(555, "ana1980", [{ email: "otro@x.com", primary: false, verified: true }, { email: `ana${MAIL}`, primary: true, verified: true }]);
  const result = await browser().loginWith("github");
  assert.equal(result.data.user.id, anaId);
});

test("GitHub sin correo verificado se rechaza", options, async () => {
  github(999, "zed", [{ email: "zed@x.com", primary: true, verified: false }]);
  const result = await browser().loginWith("github");
  assert.equal(result.status, 400);
  assert.match(result.data.message, /correo verificado/);
});

test("Discord: crea la cuenta y limpia el nombre; sin verificar o sin correo se rechaza", options, async () => {
  discord("777", "Luis 2000 Gómez", `luis${MAIL}`);
  const ok = await browser().loginWith("discord");
  assert.equal(ok.status, 200);
  assert.equal(ok.data.user.nombre, "Luis Gómez");

  discord("778", "sinverificar", `nv${MAIL}`, false);
  assert.equal((await browser().loginWith("discord")).status, 400);

  discord("779", "sincorreo", undefined, true);
  assert.equal((await browser().loginWith("discord")).status, 400);
});

test("seguridad del state: distinto, sin cookie, repetido o de otro proveedor", options, async () => {
  google("g-1", "Ana Pérez", `ana${MAIL}`);
  assert.equal((await browser().loginWith("google", { state: "x".repeat(48) })).status, 400);
  assert.equal((await browser().post("/oauth/callback", { provider: "google", code: "c", state: "s" })).status, 400);

  const web = browser();
  const { data } = await web.post("/oauth/url", { provider: "google" });
  const state = new URL(data.url).searchParams.get("state");
  assert.equal((await web.post("/oauth/callback", { provider: "google", code: "c", state })).status, 200);
  assert.equal((await web.post("/oauth/callback", { provider: "google", code: "c", state })).status, 400);

  const other = browser();
  const { data: urlData } = await other.post("/oauth/url", { provider: "google" });
  const googleState = new URL(urlData.url).searchParams.get("state");
  assert.equal((await other.post("/oauth/callback", { provider: "github", code: "c", state: googleState })).status, 400);
});

test("si el proveedor rechaza el código, la API responde 502 con un mensaje claro", options, async (t) => {
  t.mock.method(console, "error", () => {});
  fake["https://oauth2.googleapis.com/token"] = { status: 400, body: { error: "invalid_grant" } };
  const result = await browser().loginWith("google");
  assert.equal(result.status, 502);
  assert.match(result.data.message, /Google/);
});

test("una cuenta creada por una red no entra con contraseña", options, async () => {
  const result = await browser().post("/login", { email: `ana${MAIL}`, password: "Cualquiera1!" });
  assert.equal(result.status, 401);
});

test("un usuario con contraseña se vincula si el correo llega verificado, y no si no lo está", options, async () => {
  await browser().post("/registro", { nombre: "Local Uno", email: `local${MAIL}`, password: "Clave123!x" });
  google("g-2", "Local", `local${MAIL}`, true);
  assert.equal((await browser().loginWith("google")).data.user.nombre, "Local Uno");

  google("g-3", "Local", `local${MAIL}`, false);
  assert.equal((await browser().loginWith("google")).status, 400);
});

test("borrar un usuario borra sus identidades", options, async () => {
  await clean();
  const [[row]] = await pool.query("SELECT COUNT(*) AS n FROM identidades_oauth WHERE proveedor_uid IN ('g-1', 'g-2', '555', '777')");
  assert.equal(row.n, 0);
});

after(async () => {
  if (dbReady) await clean();
  server.close();
  await pool.end();
});
