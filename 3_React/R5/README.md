# Sistema de usuarios con ingreso por Google, Facebook, X, GitHub, Discord y Twitch

Es el sistema con **React Router** del R3, más el ingreso y la creación de cuenta con **Google**, **Facebook (Meta)**, **X**, **GitHub**, **Discord** y **Twitch**. También se puede seguir usando correo y contraseña.

| Parte | Carpeta | Puerto |
|---|---|---|
| Cliente React Router | `cliente-router/` | 5175 (http) y 5176 (https, solo Facebook) |
| API + BBDD | `api/` | 4005 (MySQL en el 3306) |

Rutas del cliente: `/ingresar`, `/registro`, `/auth/:proveedor/callback`, `/` (usuario) y `/usuarios` (administrador).

## Cómo iniciar R5 (paso a paso)

Todo se corre desde la carpeta `R5/` (la que tiene `package.json`, `api/` y `cliente-router/`). Sirve PowerShell o Git Bash.

### Requisitos

- **Node.js 18.11 o superior** (se probó con la 22). Verificá con `node -v`.
- **MySQL**. Con XAMPP alcanza (usuario `root`, sin contraseña, puerto 3306).

### 1. Prender MySQL

Abrí el **Panel de control de XAMPP** y tocá **Start** en la fila de **MySQL**. Tiene que quedar en verde con el puerto 3306. Sin MySQL prendido la API no arranca ni se puede correr `npm run seed`.

### 2. Instalar las dependencias (solo la primera vez)

Entrá a cada carpeta antes de instalar (con `npm --prefix carpeta install` npm agrega una dependencia falsa `file:..` al `package.json`):

```bash
npm install
cd api && npm install && cd ..
cd cliente-router && npm install && cd ..
```

### 3. Crear el archivo de configuración (solo la primera vez)

Copiá el ejemplo a `api/.env`:

```powershell
Copy-Item api\.env.example api\.env
```

Abrí `api/.env` y completá:

| Variable | Qué poner |
|---|---|
| `JWT_SECRET` | Un texto largo y propio. Para generarlo: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `DB_USER` / `DB_PASSWORD` | `root` y vacío si usás XAMPP tal como viene |
| `DB_NAME` | `r5` (la crea el paso 4) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | El administrador que vas a usar. La contraseña necesita 8+ caracteres con mayúscula, minúscula, número y un carácter especial |
| Claves de las redes | Las que tengas (ver «Configurar cada proveedor»). Las vacías quedan como «Próximamente» |
| `FACEBOOK_REDIRECT_BASE` | `https://localhost:5176` (solo si vas a probar Facebook) |

El `.env` **no se sube a git**.

### 4. Crear la base y el administrador (solo la primera vez, y cada vez que cambies `ADMIN_PASSWORD`)

```bash
npm run seed
```

Crea la base `r5`, las tablas y el administrador. Si el administrador ya existe, le actualiza la contraseña con la del `.env`.

### 5. Levantar el sistema (cada vez que lo uses)

```bash
npm run dev
```

Levanta **la API y el cliente juntos** (con `concurrently`). Tenés que ver estas dos líneas (el orden puede variar):

```text
[0] API en http://localhost:4005
[1]   ➜  Local:   http://localhost:5175/
```

Abrí **http://localhost:5175** y entrá con el administrador (`ADMIN_EMAIL` y `ADMIN_PASSWORD`) o registrate.

### 6. Solo para probar Facebook: el cliente con HTTPS

Facebook no acepta `http://localhost`. Con el paso 5 corriendo, abrí **otra terminal** en `R5/` y ejecutá:

```bash
npm run dev:https
```

Después abrí **https://localhost:5176/ingresar**. El navegador avisa que el certificado no es de confianza (es uno local autofirmado): **Avanzado → Continuar a localhost**. Recién ahí tocá **Facebook**. Cómo está hecho esto y qué hay que cargar en Meta: [arquitectura.md](arquitectura.md#4-el-https-de-facebook-explicado-en-el-código).

### 7. Cada vez que cambies el `.env`

La API lee el `.env` **solo al arrancar**. Frenala (`Ctrl + C` en la terminal del `npm run dev`) y volvé a correr `npm run dev`. Si no, el cambio no se ve (por ejemplo, un botón sigue como «Próximamente» aunque ya pegaste las claves).

### 8. Frenar todo

`Ctrl + C` en cada terminal.

### Resumen: qué corro en el día a día

| Situación | Comandos |
|---|---|
| Uso normal | prender MySQL → `npm run dev` → http://localhost:5175 |
| Probar Facebook | lo anterior + `npm run dev:https` en otra terminal → https://localhost:5176/ingresar |
| Correr las pruebas | `npm test` (con MySQL prendido) |
| Compilar el cliente | `npm run build` |

### Puertos que usa

| Puerto | Qué es |
|---|---|
| 3306 | MySQL |
| 4005 | API |
| 5175 | Cliente (http) |
| 5176 | Cliente (https, solo Facebook) |

Estos puertos son fijos (`--strictPort`): si alguno está ocupado, Vite se detiene con un error en vez de usar otro. Para ver quién lo ocupa: `netstat -ano | findstr :5175`.

### Si algo falla al arrancar

| Síntoma | Causa y arreglo |
|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL está apagado: prendelo en XAMPP (paso 1). |
| `Access denied for user` | `DB_USER` o `DB_PASSWORD` mal en `api/.env`. |
| `Faltan variables obligatorias en .env` | Falta `JWT_SECRET`, `DB_HOST`, `DB_USER` o `DB_NAME`: revisá el paso 3. |
| `Port 5175 is already in use` | Ya hay otro `npm run dev` corriendo: cerralo. |
| La pantalla carga pero los pedidos fallan | La API no está corriendo, o cambiaste `PORT` y falta actualizarlo en `cliente-router/vite.config.js`. |
| No puedo entrar como administrador | Corré `npm run seed` de nuevo: sincroniza la contraseña con `ADMIN_PASSWORD`. |

Las pruebas: `npm test` corre 19 pruebas del ingreso con redes. Los proveedores se simulan, solo hace falta MySQL prendido.

## Cómo funciona el ingreso con redes

Todo el intercambio con el proveedor lo hace la API, así los secretos nunca llegan al navegador. Todos los endpoints son `POST`.

1. La persona toca una de las redes → el cliente llama a `POST /api/auth/oauth/url`.
2. La API genera un `state` aleatorio (lo guarda en una cookie `httpOnly`) y devuelve la dirección de autorización del proveedor.
3. El navegador va al proveedor, la persona acepta y el proveedor vuelve a `http://localhost:5175/auth/<proveedor>/callback?code=...&state=...`.
4. Esa pantalla del cliente manda `code` y `state` a `POST /api/auth/oauth/callback`.
5. La API compara el `state` con la cookie, cambia el `code` por un token, pide nombre y correo al proveedor y:
   - si esa cuenta de la red ya entró antes → abre su sesión;
   - si el correo (verificado) ya tiene una cuenta → la **vincula** y abre la sesión;
   - si no existe → **crea la cuenta** con rol `usuario` (sin contraseña) y abre la sesión.

Si el proveedor no comparte un correo verificado, no se entra: se avisa en pantalla.

**Redes sin configurar:** el cliente le pregunta a la API (`POST /api/auth/oauth/proveedores`) qué redes tienen sus claves cargadas. Las que no, se ven apagadas (borde punteado) y, al tocarlas, abren un aviso «Próximamente» en vez de intentar ingresar. Apenas cargás las claves en `api/.env` y reiniciás la API, el botón se activa solo. La respuesta solo dice `enabled: true/false`, nunca las claves.

## Configurar cada proveedor

En todos los casos la **URL de retorno** es la del cliente. Las claves van en `api/.env`; después reiniciá la API (el `.env` no se recarga solo).

### Google

1. [console.cloud.google.com](https://console.cloud.google.com) → creá un proyecto → **APIs y servicios** → **Pantalla de consentimiento de OAuth** (tipo *Externo*). Mientras esté en modo *Prueba*, agregá tu Gmail en **Usuarios de prueba**.
2. **Credenciales** → **Crear credenciales** → **ID de cliente de OAuth** → tipo **Aplicación web**.
3. **Orígenes autorizados de JavaScript:** `http://localhost:5175`
4. **URI de redireccionamiento autorizados:** `http://localhost:5175/auth/google/callback`
5. Copiá el ID y el secreto:

```env
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
```

### GitHub

1. [github.com/settings/developers](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**.
2. **Homepage URL:** `http://localhost:5175`
3. **Authorization callback URL:** `http://localhost:5175/auth/github/callback`
4. Creá la app y generá un **Client secret**:

```env
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Si tu correo de GitHub es privado no hay problema: la API pide el permiso `user:email` y usa el correo verificado.

### Discord

1. Entrá a [discord.com/developers/applications](https://discord.com/developers/applications) con tu cuenta de Discord.
2. **New Application** → nombre `Sistema usuarios R5` → aceptá los términos → **Create**.
3. Menú **OAuth2**:
   - Copiá el **Client ID**.
   - **Reset Secret** → confirmá → copiá el **Client Secret** (se muestra una sola vez).
   - En **Redirects** → **Add Redirect** → `http://localhost:5175/auth/discord/callback` → **Save Changes**.
4. Cargá las claves en `api/.env`:

```env
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
```

No hace falta revisión ni agregar usuarios de prueba: entra cualquier cuenta de Discord. Debe tener el correo **verificado** (Discord → Ajustes de usuario → Mi cuenta).

### Facebook (Meta)

Facebook Login es el inicio de sesión de Meta: un solo botón cubre "Facebook" y "Meta".

1. [developers.facebook.com](https://developers.facebook.com) → **Mis apps** → **Crear app** → caso de uso **Autenticar y solicitar datos de usuarios con el inicio de sesión con Facebook** (incluye el permiso `email`).
2. **Configuración de la app** → **Básica**: copiá el **ID de la app** y la **Clave secreta**.
3. **Configuración de la app** → **Básica** → **Dominios de la app:** `localhost`.
4. **Inicio de sesión con Facebook** → **Configuración** → **URI de redireccionamiento de OAuth válidos:** `https://localhost:5176/auth/facebook/callback` (**https**, no http: las apps de Meta exigen HTTPS y rechazan `http://localhost`).
5. Mientras la app esté en modo **Desarrollo**, solo entran cuentas con un rol en la app (**Roles de la app**: administrador, desarrollador o probador).

```env
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_REDIRECT_BASE=https://localhost:5176
```

**Cómo probar Facebook en tu compu (HTTPS local):**

1. Con la API corriendo, en otra terminal: `npm run dev:https` (levanta el cliente con HTTPS en el puerto 5176; el normal, en el 5175, sigue funcionando para las demás redes).
2. Abrí **https://localhost:5176/ingresar**. El navegador avisa que el certificado no es de confianza (es uno local autofirmado): **Avanzado → Continuar a localhost**. Solo se acepta una vez.
3. Tocá **Facebook**. Facebook vuelve a `https://localhost:5176/auth/facebook/callback` y entrás.

Conviene empezar desde `https://localhost:5176`, así todo el recorrido (salir a Facebook y volver) queda en el mismo origen. Si más adelante publicás el sistema con un dominio real con HTTPS, cambiá `FACEBOOK_REDIRECT_BASE` (o quitala y usá `CLIENT_URL`) y registrá esa URL en Meta.

La cuenta de Facebook debe tener el correo confirmado; si solo tiene teléfono, Facebook no devuelve correo y no se puede entrar. Usa la versión v25.0 de la Graph API.

### X (Twitter)

1. [developer.x.com](https://developer.x.com) → **Developer Portal** → creá un proyecto y una app.
2. En la app: **User authentication settings** → **Set up**:
   - **App permissions:** *Read*
   - **Type of App:** *Web App, Automated App or Bot* (cliente confidencial)
   - **Callback URI:** `http://localhost:5175/auth/x/callback`
   - **Website URL:** `http://localhost:5175`
   - Si aparece la opción **Request email from users**, activala (X pide también las URLs de Términos y Privacidad: podés poner `http://localhost:5175`).
3. En **Keys and tokens** → **OAuth 2.0 Client ID and Client Secret**: generá y copiá los dos.

```env
X_CLIENT_ID=...
X_CLIENT_SECRET=...
```

X usa PKCE (lo hace la API sola) y pide el permiso `users.email`. Si la app de X no tiene el correo habilitado, el ingreso se rechaza con "X no nos compartió un correo verificado".

### Twitch

1. [dev.twitch.tv/console/apps](https://dev.twitch.tv/console/apps) → **Register Your Application** (hace falta tener activada la verificación en dos pasos en tu cuenta de Twitch).
2. **Name:** `Sistema usuarios R5`
3. **OAuth Redirect URLs:** `http://localhost:5175/auth/twitch/callback`
4. **Category:** *Website Integration* · **Client Type:** *Confidential* → **Create**.
5. Entrá a **Manage** de la app: copiá el **Client ID** y tocá **New Secret** para el secreto.

```env
TWITCH_CLIENT_ID=...
TWITCH_CLIENT_SECRET=...
```

Twitch solo devuelve el correo si la cuenta lo tiene verificado.

## Base de datos (3FN)

- `roles` → `usuarios` (`rol_id`).
- `identidades_oauth` guarda qué cuenta de qué red pertenece a cada usuario: `usuario_id` (FK, `ON DELETE CASCADE`), `proveedor` y `proveedor_uid`, con `UNIQUE(proveedor, proveedor_uid)` y `UNIQUE(usuario_id, proveedor)`.
- `usuarios.password_hash` admite `NULL`: las cuentas creadas con una red no tienen contraseña (desde **Mi perfil** pueden definir una).

## Reglas de validación

- **Nombre:** 2 a 80 caracteres, solo letras y espacios. Si la red trae números o símbolos en el nombre, se limpian.
- **Correo:** formato válido, hasta 120 caracteres.
- **Contraseña:** 8 a 72 caracteres, con mayúscula, minúscula, número y un carácter especial.

## Protección de datos

- Contraseñas con bcrypt; sesión en cookie `httpOnly` de 8 horas; consultas SQL parametrizadas; rol leído de la BBDD en cada pedido.
- Ingreso con redes: `state` aleatorio de un solo uso (anti-CSRF), secretos solo en la API, vuelta con `code` canjeado en el servidor y límite de intentos fallidos.
- `helmet`, CORS solo para el cliente y todos los endpoints `POST`.

## Endpoints

| Ruta | Quién |
|---|---|
| `/api/auth/registro`, `/login`, `/logout` | público |
| `/api/auth/oauth/url`, `/oauth/callback` | público |
| `/api/auth/sesion`, `/perfil` | usuario con sesión |
| `/api/usuarios/listar`, `/crear`, `/actualizar`, `/eliminar` | solo administrador |

## Si algo falla

- **Un botón se ve apagado / «Próximamente»**: esa red no tiene claves en `api/.env`, o cargaste las claves pero no reiniciaste la API.
- **"El ingreso con X todavía no está configurado"**: (solo si llamás a la API directo) faltan `X_CLIENT_ID` / `X_CLIENT_SECRET` en `api/.env`, o no reiniciaste la API.
- **Facebook dice "URL bloqueada" o "redirect_uri" inválida**: en Meta tiene que estar `https://localhost:5176/auth/facebook/callback` (con https y puerto 5176), `localhost` en Dominios de la app, y conviene empezar desde `https://localhost:5176` en vez del 5175.
- **`redirect_uri_mismatch` (Google) / "Invalid OAuth2 redirect_uri" (Discord) / "redirect_mismatch" (Twitch) / "redirect_uri is not associated" (GitHub)**: la URL de retorno cargada en el proveedor no es exactamente `http://localhost:5175/auth/<proveedor>/callback`.
- **"No pudimos validar tu cuenta de X"**: el detalle está en la consola de la API (línea `[oauth:x]`); casi siempre es el secreto mal copiado.
- **"no nos compartió un correo verificado"**: la cuenta de la red no tiene correo confirmado o no se otorgó el permiso de correo.
- **`Access denied for user`**: revisá `DB_USER` y `DB_PASSWORD`. **`ECONNREFUSED 3306`**: MySQL está apagado.
- **Un límite conocido:** el registro con correo y contraseña no verifica el correo. Por eso, quien se registra a mano con un correo ajeno podría quedar vinculado a esa cuenta cuando su dueño entre con una red. En un sistema real se agrega verificación de correo.

## Estructura

Qué hay en cada carpeta: [directorio.md](directorio.md). Cómo se conecta cada parte (cliente, API, MySQL y los proveedores) y cómo está hecho el HTTPS de Facebook: [arquitectura.md](arquitectura.md).
