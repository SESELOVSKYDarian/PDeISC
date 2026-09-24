# 📂 Directorio del proyecto

Qué hay en cada carpeta y dónde tocar para cambiar algo.
Para arrancar el sistema: [README.md](README.md) · Para entender cómo se conecta todo: [arquitectura.md](arquitectura.md)

## 🗺️ Vista general

```text
R5/
├── 📄 package.json        comandos: dev · seed · build · test
├── 📘 README.md           cómo iniciar y configurar las redes
├── 📘 arquitectura.md     cómo se conecta cada parte
├── 📘 directorio.md       este archivo
│
├── ⚙️ api/                 SERVIDOR (Express + MySQL)         → puerto 4005
│   ├── .env               claves y configuración (NO se sube a git)
│   ├── database/          tablas y administrador inicial
│   ├── test/              pruebas automáticas
│   └── src/               el código de la API
│
└── 🖥️ cliente-router/      CLIENTE (React + React Router)     → puerto 5175
    ├── vite.config.js     servidor de desarrollo + proxy /api → API
    └── src/               el código de la pantalla
```

| Parte | Carpeta | Puerto |
|---|---|:---:|
| 🖥️ Cliente | `cliente-router/` | 5175 |
| ⚙️ API | `api/` | 4005 |
| 🗄️ MySQL | (XAMPP) | 3306 |

---

## ⚙️ api/

```text
api/
├── 🗄️ database/
│   ├── schema.sql          tablas: roles, usuarios, identidades_oauth (3FN)
│   ├── init.js             crea las tablas
│   └── seed-admin.js       crea la BBDD, las tablas y el administrador
│                           (si ya existe, sincroniza su contraseña con ADMIN_PASSWORD)
├── 🧪 test/
│   ├── oauth.unit.test.js  sin BBDD: nombre, state y URLs de cada red
│   └── oauth.flow.test.js  ingreso completo con proveedores simulados
└── 📁 src/
    ├── server.js           arranca el servidor
    ├── app.js              arma Express (helmet, cors, rutas, errores)
    ├── config.js           lee el .env (incluye las claves de cada red)
    │
    ├── 🛣️ routes/           auth.routes.js · users.routes.js   (todo POST)
    │
    ├── 🎮 controllers/
    │   ├── auth/           register · login · logout · session · updateProfile
    │   ├── oauth/          providers · url · callback
    │   └── users/          list · create · update · remove   (solo administrador)
    │
    ├── 🌐 oauth/            todo lo de las redes sociales
    │   ├── providers/      un archivo por red: google · facebook · x · github · discord · twitch
    │   │                   (index.js las registra)
    │   ├── http.js         pedidos salientes a los proveedores
    │   ├── state.js        "state" anti-CSRF (y PKCE para X) en cookie httpOnly
    │   ├── redirectUri.js  URL de retorno de cada red
    │   └── oauthError.js   error con código HTTP y mensaje
    │
    ├── 🧩 services/
    │   ├── db.js           conexión MySQL
    │   ├── oauth/          resolveUser.js: busca, vincula o crea el usuario
    │   └── users/          una consulta SQL por archivo
    │
    ├── 🛡️ middleware/       requireAuth · requireAdmin · rateLimiters · ensureBody · errorHandlers
    ├── ✅ validators/       reglas de nombre, correo, contraseña y usuario
    └── 🔧 utils/            passwords (bcrypt) · token (JWT) · cookies · toId · providerName
```

**Los tres controladores de `oauth/`, en orden de uso:**

| # | Archivo | Cuándo se llama | Qué hace |
|:-:|---|---|---|
| 1 | `providers.js` | al abrir el login | dice qué redes tienen claves (`enabled: true/false`) |
| 2 | `url.js` | al tocar una red | crea el `state` y devuelve la dirección del proveedor |
| 3 | `callback.js` | al volver del proveedor | valida el `state`, canjea el código, busca/crea el usuario y abre la sesión |

---

## 🖥️ cliente-router/

```text
src/
├── main.jsx · App.jsx      arranque y rutas
├── 📄 pages/
│   ├── AuthPage            login y registro
│   ├── OAuthCallbackPage   pantalla a la que vuelve el proveedor
│   ├── HomePage            panel del usuario común
│   └── UsersPage           panel del administrador
├── context/                AuthContext (sesión + oauthLogin) · ThemeContext (tema claro/oscuro)
├── services/               api.js (Axios) · authService.js · usersService.js
├── hooks/                  useUsers · useAuthRequest · useOAuthCallback
│                           useOAuthProviders · useScrollTop
├── validation/             reglas de los formularios
├── utils/                  formatDate · initials · onlyLetters · homePath · oauthProviders
├── lib/utils.js            helper cn() de shadcn
├── 🎨 styles/
│   ├── base.css · index.css        colores, reset y entrada de estilos
│   ├── auth/                       login y registro
│   │   ├── social.css              botones de las redes
│   │   ├── soon-dialog.css         aviso «Próximamente»
│   │   └── oauth-status.css        pantalla de retorno del proveedor
│   └── panel.css                   tema shadcn/Tailwind (solo dentro de un panel)
└── 🧱 components/
    ├── auth/               AuthForm · SocialButtons · ProviderSoonDialog · ProviderIcon
    ├── admin/              UserTable (tabla) · UserCard (celular) · UserActions · búsqueda y modales
    ├── profile/            panel del usuario común
    ├── common/             marco de los paneles · logout con confirmación
    ├── guards/             PrivateRoute · AdminRoute
    ├── layout/             AppLayout
    └── ui/                 componentes shadcn/ui
```

### 🧭 Rutas del cliente

| Ruta | Pantalla | Quién entra |
|---|---|---|
| `/ingresar` | login | público |
| `/registro` | crear cuenta | público |
| `/auth/:proveedor/callback` | vuelta del proveedor | público (la abre la red) |
| `/` | panel de usuario | con sesión |
| `/usuarios` | panel de administrador | solo administrador |

---

## 🔎 «Quiero cambiar…» → «Dónde está»

| Quiero cambiar… | Archivo |
|---|---|
| El aspecto de los botones de las redes | `cliente-router/src/styles/auth/social.css` |
| Qué redes se muestran y en qué orden | `cliente-router/src/utils/oauthProviders.js` |
| El logo de una red | `cliente-router/src/components/auth/ProviderIcon.jsx` |
| El aviso «Próximamente» | `components/auth/ProviderSoonDialog.jsx` |
| Qué pasa al volver del proveedor | `pages/OAuthCallbackPage.jsx` + `hooks/useOAuthCallback.js` |
| Los pedidos a la API | `services/authService.js` |
| Las claves de una red | `api/.env` |
| Cómo habla la API con una red | `api/src/oauth/providers/<red>.js` |
| La URL de retorno | `api/src/oauth/redirectUri.js` |
| Cómo se crea o vincula el usuario | `api/src/services/oauth/resolveUser.js` |
| Las tablas | `api/database/schema.sql` |
| La contraseña del administrador | `ADMIN_PASSWORD` en `api/.env` → `npm run seed` |

## 🔗 Endpoints (todos `POST`)

| Grupo | Rutas |
|---|---|
| Cuenta | `/api/auth/registro` · `/login` · `/logout` · `/sesion` · `/perfil` |
| Redes | `/api/auth/oauth/proveedores` · `/oauth/url` · `/oauth/callback` |
| Usuarios (solo administrador) | `/api/usuarios/listar` · `/crear` · `/actualizar` · `/eliminar` |
