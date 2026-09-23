# Cómo está conectado R5

Este documento explica **cómo se conecta cada parte del sistema** y **cómo está hecho en el código el HTTPS de Facebook**. Para arrancar el proyecto, mirá el [README](README.md); para saber dónde está cada archivo, [directorio.md](directorio.md).

## 1. Mapa general

```text
                        NAVEGADOR
                 http://localhost:5175   (o)   https://localhost:5176
                            │
            ┌───────────────┴────────────────┐
            │   CLIENTE (React + Vite)       │  cliente-router/   → dos copias del mismo código:
            │   puerto 5175 (http)           │                      npm run dev        → 5175 (http)
            │   puerto 5176 (https)          │                      npm run dev:https  → 5176 (https)
            └───────────────┬────────────────┘
                            │  todo lo que empieza con /api lo reenvía Vite (proxy)
                            ▼
            ┌────────────────────────────────┐
            │   API (Node + Express)         │  api/   → puerto 4005
            │   solo endpoints POST          │
            └───────┬─────────────────┬──────┘
                    │                 │
                    ▼                 ▼
           ┌────────────────┐   ┌──────────────────────────────────────┐
           │  MySQL (3306)  │   │  Proveedores (internet, por HTTPS)   │
           │  BBDD "r5"     │   │  Google · Facebook · X · GitHub      │
           └────────────────┘   │  Discord · Twitch                    │
                                └──────────────────────────────────────┘
```

El navegador **solo habla con el cliente**. Nunca habla directo con la API ni con MySQL. Con los proveedores habla en un único momento: cuando lo mandamos a que la persona acepte los permisos (una redirección). Todo lo demás con los proveedores lo hace la **API, de servidor a servidor**, para que los secretos no pasen por el navegador.

## 2. Las cinco conexiones, una por una

### 2.1 Navegador ↔ Cliente

- El cliente es una app React con React Router (`cliente-router/`), servida por el servidor de desarrollo de Vite.
- Hay **dos servidores de Vite con el mismo código**, porque uno solo no puede hablar http y https a la vez:

| Comando | Puerto | Protocolo | Para qué |
|---|---|---|---|
| `npm run dev` | 5175 | http | uso diario y todas las redes menos Facebook |
| `npm run dev:https` | 5176 | https | necesario para probar Facebook |

- Rutas del cliente (`src/App.jsx`): `/ingresar`, `/registro`, `/auth/:provider/callback` (pantalla a la que vuelve el proveedor), `/` (usuario) y `/usuarios` (administrador).

### 2.2 Cliente ↔ API

- El cliente usa Axios con una dirección **relativa**: `cliente-router/src/services/api.js`.

```js
export const api = axios.create({
  baseURL: "/api",          // relativa: no dice ni puerto ni protocolo
  withCredentials: true,    // la cookie de sesión viaja sola
});
```

- Como `/api` es relativa, el navegador la manda **al mismo servidor del que cargó la página** (5175 o 5176). Ese servidor de Vite la reenvía a la API. Está en `cliente-router/vite.config.js`:

```js
server: { proxy: { "/api": "http://localhost:4005" } },
```

- **Por qué se hace así:** para el navegador todo queda en **un solo origen** (mismo protocolo, host y puerto). Las cookies viajan sin restricciones y no hace falta configurar CORS para el cliente. Si la API estuviera en otro origen (`http://localhost:4005` desde una página `https://localhost:5176`), el navegador trataría los pedidos como de otro sitio y la cookie de seguridad del inicio de sesión podría no viajar.
- **Si cambiás `PORT` en `api/.env`**, hay que cambiar también el `4005` de `vite.config.js`.
- **Todos los endpoints son `POST`** (incluso listar y consultar). Están en `api/src/routes/`.
- En `api/src/app.js` queda un CORS (`origin: [config.clientUrl]`) por si algún día el cliente llamara a la API desde otro origen; con el proxy no se usa.

### 2.3 API ↔ MySQL

- Conexión en `api/src/services/db.js`: un `pool` de `mysql2` que lee los datos de `api/.env` (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, vía `api/src/config.js`).
- Todas las consultas están parametrizadas (`?`) y hay **un archivo por consulta** en `api/src/services/users/`.
- Tablas (`api/database/schema.sql`, en 3FN):
  - `roles`: `administrador` y `usuario`.
  - `usuarios`: nombre, correo, contraseña (hash bcrypt, **puede ser `NULL`** para cuentas creadas con una red) y rol.
  - `identidades_oauth`: qué cuenta de qué red pertenece a cada usuario (`usuario_id`, `proveedor`, `proveedor_uid`), con `UNIQUE(proveedor, proveedor_uid)` y `ON DELETE CASCADE`.
- `npm run seed` (`api/database/seed-admin.js`) crea la base, las tablas y el administrador del `.env`; si el administrador ya existe, le sincroniza la contraseña.

### 2.4 Navegador ↔ Proveedor (solo una redirección)

Cuando la persona toca una red, el cliente pide la dirección a la API (`POST /api/auth/oauth/url`) y hace `window.location.assign(url)`. El navegador va a Google, GitHub, etc.; la persona acepta y el proveedor la **devuelve a nuestro cliente** con `?code=...&state=...`.

La dirección de vuelta se llama `redirect_uri` y **tiene que estar registrada en la consola de cada proveedor** y ser idéntica a la que manda la API:

| Red | Dirección de vuelta |
|---|---|
| Google, GitHub, Discord, X, Twitch | `http://localhost:5175/auth/<red>/callback` |
| Facebook | `https://localhost:5176/auth/facebook/callback` |

### 2.5 API ↔ Proveedor (de servidor a servidor)

Al volver, el cliente le manda `code` y `state` a la API (`POST /api/auth/oauth/callback`). La API cambia el `code` por un token y pide el perfil, usando `fetch` (`api/src/oauth/http.js`: `postForm` y `getJson`, con 10 s de tiempo máximo). Cada red tiene su archivo en `api/src/oauth/providers/` con sus direcciones:

| Red | Pantalla de permisos | Canje del código | Perfil | Permisos pedidos | Particularidad |
|---|---|---|---|---|---|
| Google | `accounts.google.com/o/oauth2/v2/auth` | `oauth2.googleapis.com/token` | `openidconnect.googleapis.com/v1/userinfo` | `openid email profile` | usa `email_verified` |
| Facebook | `www.facebook.com/v25.0/dialog/oauth` | `graph.facebook.com/v25.0/oauth/access_token` | `graph.facebook.com/v25.0/me?fields=id,name,email` | `email,public_profile` | Graph API v25.0; solo devuelve el correo si está confirmado |
| X | `x.com/i/oauth2/authorize` | `api.x.com/2/oauth2/token` | `api.x.com/2/users/me?user.fields=confirmed_email` | `users.read tweet.read users.email` | **PKCE** obligatorio y `Authorization: Basic` (id:secreto) |
| GitHub | `github.com/login/oauth/authorize` | `github.com/login/oauth/access_token` | `api.github.com/user` + `api.github.com/user/emails` | `read:user user:email` | el correo puede ser privado: se pide aparte y se elige uno verificado |
| Discord | `discord.com/oauth2/authorize` | `discord.com/api/oauth2/token` | `discord.com/api/users/@me` | `identify email` | exige un `User-Agent` con formato propio |
| Twitch | `id.twitch.tv/oauth2/authorize` | `id.twitch.tv/oauth2/token` | `api.twitch.tv/helix/users` | `user:read:email` | la API pide además la cabecera `Client-Id` |

Todos los archivos de red tienen la misma forma (`name`, `label`, `isConfigured()`, `buildUrl()`, `fetchProfile()`) y devuelven el perfil normalizado `{ uid, nombre, email, emailVerified }`. `api/src/oauth/providers/index.js` los registra.

## 3. El recorrido completo, con los archivos

```text
1. Persona toca "Facebook"            SocialButtons.jsx → AuthPage.jsx (socialLogin)
2. POST /api/auth/oauth/url           controllers/oauth/url.js
   · getProvider("facebook")          oauth/providers/index.js (¿tiene claves?)
   · startState(): crea el "state"    oauth/state.js (cookie httpOnly "oauth_state", 10 min)
   · redirectUri("facebook")          oauth/redirectUri.js  → https://localhost:5176/auth/facebook/callback
   · provider.buildUrl()              oauth/providers/facebook.js
3. Navegador → www.facebook.com       la persona acepta los permisos
4. Facebook → https://localhost:5176/auth/facebook/callback?code=...&state=...
                                      OAuthCallbackPage.jsx + hooks/useOAuthCallback.js
5. POST /api/auth/oauth/callback      controllers/oauth/callback.js
   · checkState(): compara el state   oauth/state.js (con la cookie; se usa una sola vez)
   · provider.fetchProfile()          canje del code + pedido del perfil (servidor a servidor)
   · resolveOAuthUser()               services/oauth/resolveUser.js
       - ya entró antes con esa red   → abre su sesión
       - el correo verificado ya existe → vincula la red a esa cuenta
       - no existe                    → crea la cuenta (rol "usuario", sin contraseña)
   · sendSession()                    utils/cookies.js → cookie "session" (JWT con el id, 8 h)
6. El cliente guarda el usuario en AuthContext y va a "/" o "/usuarios" según el rol.
```

**Seguridad del recorrido:**

- **`state` anti-CSRF:** aleatorio, guardado en una cookie `httpOnly`, comparado con `timingSafeEqual` y borrado al usarse. Si no coincide, se rechaza.
- **PKCE (solo X):** `startState(res, "x", true)` también crea un `code_verifier`, lo guarda en la misma cookie y manda a la URL solo el desafío (`SHA-256` del verificador). Al canjear el código, `checkState` devuelve el verificador.
- **Solo entra quien tiene correo verificado.** Si la red no lo comparte, no se crea nada.
- **Los secretos nunca llegan al navegador.** Canjear el código y pedir el perfil lo hace siempre la API; el cliente solo recibe el usuario ya validado.

## 4. El HTTPS de Facebook, explicado en el código

### 4.1 El problema

Las apps de Meta creadas desde 2018 traen activada la opción **"Forzar HTTPS"** en el inicio de sesión: la lista de *URI de redireccionamiento de OAuth válidos* rechaza `http://localhost:5175/...`. Por eso Facebook necesita que el cliente también responda en `https://`.

### 4.2 La solución, en cinco piezas

**① Un servidor de Vite con HTTPS.** `cliente-router/vite.config.js` usa el plugin `@vitejs/plugin-basic-ssl` **solo cuando se arranca en modo `https`**:

```js
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === "https" ? [basicSsl()] : [])],
  ...
  server: { proxy: { "/api": "http://localhost:4005" } },
}));
```

El plugin genera un **certificado autofirmado** para `localhost`. Por eso el navegador avisa "la conexión no es privada" la primera vez: hay que tocar **Avanzado → Continuar a localhost**. Es normal en desarrollo.

**② Un segundo puerto.** En `cliente-router/package.json`:

```json
"dev":       "vite --port 5175 --strictPort",
"dev:https": "vite --port 5176 --strictPort --mode https"
```

`--mode https` es lo que activa el plugin de la pieza ①. En la raíz, `npm run dev:https` llama a ese script. El 5175 (http) queda intacto para las demás redes.

**③ Una dirección de vuelta propia para Facebook.** `api/src/config.js` permite indicar, **por red**, una base distinta de la del cliente:

```js
const provider = (idName, secretName, baseName) => ({
  clientId: process.env[idName],
  clientSecret: process.env[secretName],
  redirectBase: process.env[baseName],          // ej.: FACEBOOK_REDIRECT_BASE
});
...
facebook: provider("FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET", "FACEBOOK_REDIRECT_BASE"),
```

Y `api/src/oauth/redirectUri.js` la usa si existe (y si no, usa `CLIENT_URL`):

```js
export const redirectUri = (providerName) =>
  `${config.oauth[providerName]?.redirectBase || config.clientUrl}/auth/${providerName}/callback`;
```

Con `FACEBOOK_REDIRECT_BASE=https://localhost:5176` en `api/.env`, **solo Facebook** vuelve a `https://localhost:5176/auth/facebook/callback`. Las demás redes siguen usando `CLIENT_URL` (`http://localhost:5175`).

**④ La misma dirección en los dos pasos.** `redirectUri(...)` se llama en `controllers/oauth/url.js` (al armar la URL de permisos) y en `controllers/oauth/callback.js` (al canjear el código). Meta exige que sean **idénticas**; como las dos salen de la misma función, siempre coinciden.

**⑤ El proxy `/api` (mismo origen).** Sin el proxy, una página `https://localhost:5176` llamando a `http://localhost:4005` sería un pedido entre orígenes distintos, y la cookie del `state` podría no viajar. Con el proxy, el cliente llama a `/api` (relativa) y todo ocurre dentro de `https://localhost:5176`. Ver la sección 2.2.

### 4.3 Lo que hay que configurar en Meta (una sola vez)

En [developers.facebook.com](https://developers.facebook.com), en tu app:

1. **Configuración de la app → Básica → Dominios de la app:** `localhost`.
2. **Inicio de sesión con Facebook → Configuración:**
   - *Inicio de sesión de OAuth de cliente:* **Sí**
   - *Inicio de sesión de OAuth web:* **Sí**
   - *Forzar HTTPS:* **Sí** (dejalo activado)
   - *URI de redireccionamiento de OAuth válidos:* `https://localhost:5176/auth/facebook/callback` (sin barra final, sin espacios)
   - **Guardar cambios.** El *Validador de URI* solo lee lo ya guardado.
3. Mientras la app esté en **modo Desarrollo**, solo pueden entrar cuentas con un rol en la app (**Roles de la app**).

### 4.4 Cómo se prueba

1. `npm run dev` y, en otra terminal, `npm run dev:https`.
2. Abrí **https://localhost:5176/ingresar**, aceptá el certificado y tocá **Facebook**.
3. Facebook vuelve a `https://localhost:5176/auth/facebook/callback` y se abre la sesión.

Las cookies no distinguen puertos ni protocolo para el mismo `localhost`, así que la sesión iniciada en el 5176 también vale en el 5175 y al revés. Aun así conviene **empezar y terminar el recorrido de Facebook en el 5176**.

### 4.5 Si más adelante lo publicás

Con un dominio real con HTTPS ya no hace falta el certificado local: poné `CLIENT_URL=https://tu-dominio.com`, borrá `FACEBOOK_REDIRECT_BASE`, registrá `https://tu-dominio.com/auth/facebook/callback` en Meta (y las de las otras redes con ese dominio) y arrancá la API con `NODE_ENV=production` (activa `secure` en las cookies).

## 5. Sesión y cookies

| Cookie | Qué guarda | Dura | Opciones |
|---|---|---|---|
| `session` | JWT con **solo el id** del usuario (el rol se lee siempre de la BBDD) | 8 h | `httpOnly`, `sameSite=lax`, `secure` solo en producción |
| `oauth_state` | `<red>.<state>` (y `.<verificador PKCE>` en X) | 10 min | las mismas; se borra al usarse |

`api/src/middleware/requireAuth.js` valida la cookie `session` y carga al usuario real desde MySQL en cada pedido.

## 6. Cómo agregar una red nueva

1. Crear `api/src/oauth/providers/<red>.js` con la misma forma que los demás (`name`, `label`, `isConfigured`, `buildUrl`, `fetchProfile`).
2. Sumar sus dos variables en `api/src/config.js` y en `api/.env.example`.
3. Registrarla en `api/src/oauth/providers/index.js`.
4. Agregarla a `cliente-router/src/utils/oauthProviders.js` y darle ícono en `components/auth/ProviderIcon.jsx`.
5. Registrar su URL de vuelta (`http://localhost:5175/auth/<red>/callback`) en su consola y cargar las claves.
6. Sumar su caso a `api/test/oauth.flow.test.js`.
