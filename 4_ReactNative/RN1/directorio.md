# DePaso — directorio

Acceso de usuarios con React Native (Expo + TypeScript), API Node/Express y MySQL (XAMPP).
Paso a paso para instalar y arrancar todo (incluido ngrok): [README.md](README.md).

## Cómo correrlo

1. Encender **MySQL** desde el panel de XAMPP (puerto 3306, usuario `root` sin contraseña).
2. Una sola vez: `npm run instalar` y copiar `backend/.env.example` a `backend/.env`.
3. `npm run dev` en esta carpeta levanta API + app. Con ngrok para el celular: `npm run dev:todo`.
   Al arrancar, la API crea la base `depaso`, las tablas y el seed solos.

Paso a paso completo en [README.md](README.md).

| Servicio | Puerto |
| --- | --- |
| API (`/api/...`) | 3001 |
| Retorno de las redes (`/auth/:red/callback`) | 5175 |
| Expo / Metro (web y celular) | 8082 |

## Raíz

| Archivo | Responsabilidad |
| --- | --- |
| `package.json` | Comando único: `dev` (API + app + QR), `dev:todo` (+ ngrok), `instalar`. |
| `scripts/qr.js` | Imprime el QR de Expo Go con la IP de la PC (Expo no lo muestra cuando corre dentro de `concurrently`). |
| `README.md` | Instalación, ngrok, uso diario y problemas comunes. |
| `.gitignore` | Excluye `node_modules`, `.env`, `certs/`, builds y carpetas de IA. |

## backend/

| Ruta | Responsabilidad |
| --- | --- |
| `src/server.js` | Arranque: init de BBDD y los dos puertos. |
| `src/app.js` | Arma la API (3001, helmet + CORS solo localhost/red local) y el receptor de retorno OAuth (5175, helmet + límite de pedidos). |
| `src/config.js` | Lee el `.env`. |
| `src/db.js` | Pool de MySQL. |
| `src/routes/api.routes.js` | Endpoints. **Todos POST**, con límite de intentos en login y registro. |
| `src/controllers/` | Reciben el pedido y responden JSON (`auth`, `oauth`). |
| `src/services/` | Lógica: `auth` (login, registro, bcrypt), `users` (SQL parametrizado), `oauth`. |
| `src/validators/` | Validación del body (el backend nunca confía en la app). |
| `src/oauth/` | `providers.js` (Google, Discord, Meta), `http.js`, `store.js` (state y tickets de un solo uso, con tope y vencimiento), `lan.js` y `https.js` (retorno con nip.io si no hay ngrok). |
| `database/schema.sql` | Tablas en 3FN: `roles`, `usuarios`, `proveedores`, `identidades`. |
| `database/seed.js` | Roles, proveedores y usuarios de prueba (con hash; no se crean con `NODE_ENV=production`). |
| `database/init.js` | Crea base + tablas + seed; también `npm run db:init`. |

### Endpoints

- `POST /api/auth/login` → `{ ok, usuario:{id,nombre,email,rol} }` o `{ ok:false, mensaje }`.
- `POST /api/auth/registro` `{nombre,email,password}` → 201 con el usuario; 409 si el email ya existe; 400 si no valida.
- `POST /api/oauth/proveedores` → redes disponibles.
- `POST /api/oauth/url` → URL de la red para abrir en el navegador.
- `POST /api/oauth/canjear` → cambia el ticket de un solo uso por el usuario.
- `GET /auth/:red/callback` (puerto 5175) → única excepción de GET: así vuelve la red por estándar OAuth.

## app/

| Ruta | Responsabilidad |
| --- | --- |
| `App.tsx` | Guarda el `usuario` y la página en estado y elige: Login, Registro o Bienvenida. Pasa el usuario **por props**. |
| `src/screens/LoginScreen.tsx` | Página principal con el formulario de ingreso. |
| `src/screens/RegisterScreen.tsx` | Página de registro (nombre, email, contraseña y confirmación). |
| `src/screens/WelcomeScreen.tsx` | Página de bienvenida: recibe `usuario` y `onSalir` por props (2 columnas desde 800px). |
| `src/components/auth/` | `AuthLayout` (marco común, 1 columna en móvil y 2 desde 800px), `LoginForm`, `RegisterForm`, `ErrorBanner`, `AuthLink`, `FormField` (label flotante), `PasswordInput`, `SocialButtons`. |
| `src/components/welcome/` | `Saludo`, `UserCard`, `InfoRow`. |
| `src/components/common/` | `Button`, `PressableScale`, `FadeIn`, `Logo`, `LogoTile`, `BrandIcons` (Google, Discord, Meta), `ThemeToggle`. |
| `src/services/` | `http` (POST), `auth`, `oauth`, `apiUrl` (detecta la IP de la PC). |
| `src/theme/` | `colors` (tokens claro/oscuro), `ThemeProvider` (guarda la preferencia), `iconos` (tamaños), `logo` (isotipo). |
| `src/utils/validators.ts` | Validación de nombre, email, contraseña y confirmación en la app. |
| `src/types/usuario.ts` | Tipos `Usuario` y `Proveedor`. |

## Ingreso con Google / Meta / Discord

Reusa las apps OAuth de `3_React/R5`. El backend elige la URL de retorno según desde dónde se pide:

| Cliente | URL de retorno | Cómo llega a la PC |
| --- | --- | --- |
| Web / emulador | `http://localhost:5175/auth/<red>/callback` (ya registrada en R5) | directo |
| Celular (Expo Go) | `<OAUTH_MOVIL_BASE>/auth/<red>/callback` | túnel **ngrok** al puerto 5175 |

### Celular con ngrok (dominio fijo)

1. Una sola vez por PC: instalar ngrok y correr `ngrok config add-authtoken <tu token>` (misma cuenta = mismo dominio).
2. Cada vez: `ngrok http 5175 --url=<tu-dominio>.ngrok-free.dev` (el plan Free incluye un dominio estático).
3. En `backend/.env`: `OAUTH_MOVIL_BASE=https://<tu-dominio>.ngrok-free.dev`.
4. Una sola vez en cada consola (Google: *Credenciales → cliente OAuth → URIs de redireccionamiento autorizados*):
   `https://<tu-dominio>.ngrok-free.dev/auth/<red>/callback`. El backend imprime las URLs exactas al arrancar.

La URL no cambia aunque cambies de PC o de red. Si `OAUTH_MOVIL_BASE` está vacío, el backend usa
`https://<ip>.nip.io:5176` con certificado propio (`backend/certs/`), pero esa URL sí cambia con la IP.
La primera vez ngrok muestra una página de aviso: tocar *Visit Site*.
