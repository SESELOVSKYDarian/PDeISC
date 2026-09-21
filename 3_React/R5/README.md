# Sistema de usuarios con ingreso por Google, GitHub y Discord

Es el sistema con **React Router** del R3, más el ingreso y la creación de cuenta con **Google**, **GitHub** y **Discord**. También se puede seguir usando correo y contraseña.

| Parte | Carpeta | Puerto |
|---|---|---|
| Cliente React Router | `cliente-router/` | 5175 |
| API + BBDD | `api/` | 4005 |

Rutas del cliente: `/ingresar`, `/registro`, `/auth/:proveedor/callback`, `/` (usuario) y `/usuarios` (administrador).

## Requisitos

- Node.js 18 o superior
- MySQL (XAMPP sirve: iniciá el módulo **MySQL**)

## Instalación

```bash
npm install
cd api && npm install && cd ..
cd cliente-router && npm install && cd ..
```

Entrá a cada carpeta antes de instalar: con `npm --prefix carpeta install` npm agrega una dependencia falsa (`file:..`) al `package.json`.

Copiá `api/.env.example` a `api/.env` y completá `JWT_SECRET` (un texto largo y propio). Las claves de Google, GitHub y Discord se explican abajo.

## Puesta en marcha

```bash
npm run seed   # una sola vez: crea la BBDD r5, las tablas y el administrador
npm run dev    # API + cliente
```

- Cliente: http://localhost:5175
- API: http://localhost:4005
- Administrador: `ADMIN_EMAIL` y `ADMIN_PASSWORD` del `.env`.
- Pruebas: `npm test` (13 pruebas del ingreso con redes; Google, GitHub y Discord se simulan, solo hace falta MySQL prendido).

## Cómo funciona el ingreso con redes

Todo el intercambio con el proveedor lo hace la API, así los secretos nunca llegan al navegador. Todos los endpoints son `POST`.

1. La persona toca **Google / GitHub / Discord** → el cliente llama a `POST /api/auth/oauth/url`.
2. La API genera un `state` aleatorio (lo guarda en una cookie `httpOnly`) y devuelve la dirección de autorización del proveedor.
3. El navegador va al proveedor, la persona acepta y el proveedor vuelve a `http://localhost:5175/auth/<proveedor>/callback?code=...&state=...`.
4. Esa pantalla del cliente manda `code` y `state` a `POST /api/auth/oauth/callback`.
5. La API compara el `state` con la cookie, cambia el `code` por un token, pide nombre y correo al proveedor y:
   - si esa cuenta de la red ya entró antes → abre su sesión;
   - si el correo (verificado) ya tiene una cuenta → la **vincula** y abre la sesión;
   - si no existe → **crea la cuenta** con rol `usuario` (sin contraseña) y abre la sesión.

Si el proveedor no comparte un correo verificado, no se entra: se avisa en pantalla.

## Configurar cada proveedor

En los tres casos la **URL de retorno** es la del cliente. Las claves van en `api/.env`; después reiniciá la API (el `.env` no se recarga solo).

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

- **"El ingreso con X todavía no está configurado"**: faltan `X_CLIENT_ID` / `X_CLIENT_SECRET` en `api/.env`, o no reiniciaste la API.
- **`redirect_uri_mismatch` (Google) / "Invalid OAuth2 redirect_uri" (Discord) / "redirect_uri is not associated" (GitHub)**: la URL de retorno cargada en el proveedor no es exactamente `http://localhost:5175/auth/<proveedor>/callback`.
- **"No pudimos validar tu cuenta de X"**: el detalle está en la consola de la API (línea `[oauth:x]`); casi siempre es el secreto mal copiado.
- **"no nos compartió un correo verificado"**: la cuenta de la red no tiene correo confirmado o no se otorgó el permiso de correo.
- **`Access denied for user`**: revisá `DB_USER` y `DB_PASSWORD`. **`ECONNREFUSED 3306`**: MySQL está apagado.
- **Un límite conocido:** el registro con correo y contraseña no verifica el correo. Por eso, quien se registra a mano con un correo ajeno podría quedar vinculado a esa cuenta cuando su dueño entre con una red. En un sistema real se agrega verificación de correo.

## Estructura

Está explicada en [directorio.md](directorio.md).
