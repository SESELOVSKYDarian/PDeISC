# Directorio del proyecto

Sistema de usuarios con React Router + API Express + MySQL, con ingreso por correo/contraseña y por Google, Facebook, X, GitHub, Discord y Twitch.

| Parte | Carpeta | Puerto |
|---|---|---|
| Cliente con React Router | `cliente-router/` | 5175 |
| API + BBDD | `api/` | 4005 |

Cómo arrancar paso a paso: [README.md](README.md#cómo-iniciar-r5-paso-a-paso). Cómo se conecta todo y cómo está hecho el HTTPS de Facebook: [arquitectura.md](arquitectura.md).

Todo junto: `npm run dev` en la raíz (usa `concurrently`). Primera vez: `npm run seed`.

`npm run dev:https` levanta además el cliente con HTTPS local en el puerto 5176 (Facebook exige https). En los dos clientes, `/api` lo reenvía Vite a la API (`vite.config.js`), así el navegador siempre habla con un solo origen.

## api/

```
api/
├── database/
│   ├── schema.sql        tablas roles, usuarios e identidades_oauth (3FN)
│   ├── init.js           crea las tablas
│   └── seed-admin.js     crea la BBDD, las tablas y el administrador; si ya existe, sincroniza su contraseña con ADMIN_PASSWORD
├── test/                 oauth.unit.test.js (sin BBDD), oauth.flow.test.js (ingreso completo con proveedores simulados)
└── src/
    ├── server.js         arranca el servidor
    ├── app.js            arma Express (helmet, cors, rutas, errores)
    ├── config.js         variables del .env (incluye las claves de cada red)
    ├── routes/           auth.routes.js, users.routes.js (solo POST)
    ├── controllers/
    │   ├── auth/         register, login, logout, session, updateProfile
    │   ├── oauth/        proveedores (qué redes están habilitadas), url (paso 1: dirección del proveedor), callback (paso 2: canje del código y sesión)
    │   └── users/        list, create, update, remove (solo administrador)
    ├── oauth/            todo lo de las redes
    │   ├── providers/    un archivo por red (google, facebook, x, github, discord, twitch): arma su URL y pide el perfil; index.js los registra
    │   ├── http.js       pedidos salientes a los proveedores
    │   ├── state.js      "state" anti-CSRF (y verificador PKCE para X) en cookie httpOnly
    │   ├── redirectUri.js  URL de retorno (pantalla del cliente)
    │   └── oauthError.js   error con código HTTP y mensaje
    ├── services/
    │   ├── db.js         conexión MySQL
    │   ├── oauth/        resolveUser.js: busca, vincula o crea el usuario de una red
    │   └── users/        una consulta SQL por archivo (identities.js: cuentas de redes)
    ├── middleware/       requireAuth, requireAdmin, rateLimiters, ensureBody, errorHandlers
    ├── validators/       reglas de nombre, email, contraseña y usuario
    └── utils/            passwords (bcrypt), token (JWT), cookies, toId, providerName (limpia el nombre de la red)
```

## cliente-router/

```
src/
├── main.jsx, App.jsx     arranque y rutas (/ingresar, /registro, /auth/:provider/callback, /, /usuarios)
├── pages/                AuthPage, OAuthCallbackPage, HomePage, UsersPage
├── context/              AuthContext (sesión + oauthLogin), ThemeContext (tema en localStorage)
├── services/             api.js (Axios), authService.js, usersService.js
├── hooks/                useUsers, useAuthRequest, useOAuthCallback, useOAuthProviders (redes habilitadas), useScrollTop
├── validation/           reglas de useForm: nombre, email, contraseña
├── utils/                formatDate (DD/MM/AA), initials, onlyLetters, homePath, oauthProviders
├── lib/utils.js          helper cn() de shadcn
├── styles/
│   ├── base.css, index.css   colores, reset y entrada de estilos del login/registro
│   ├── auth/                 partes del diseño del login y registro (social.css: botones de las redes; soon-dialog.css: aviso «Próximamente»; oauth-status.css: pantalla de retorno del proveedor)
│   └── panel.css             tema shadcn/Tailwind (solo cuando se ve un panel)
└── components/
    ├── auth/             login y registro (AuthForm, SocialButtons, ProviderIcon y sus piezas)
    ├── admin/            panel del administrador (UserTable: tabla en pantallas medianas/grandes y UserCard en el celular; UserActions compartido; búsqueda, modales)
    ├── profile/          panel del usuario común (bienvenida + editar perfil)
    ├── common/           marco de los paneles, logout con confirmación, botón de subir
    ├── guards/           PrivateRoute, AdminRoute
    ├── layout/           AppLayout
    └── ui/               componentes shadcn/ui
```

## Dónde está cada cosa del ingreso con redes

| Qué | Dónde |
|---|---|
| Botones de las redes (los apagados y su aviso «Próximamente») | `cliente-router/src/components/auth/SocialButtons.jsx` y `ProviderSoonDialog.jsx` |
| Pantalla a la que vuelve el proveedor | `pages/OAuthCallbackPage.jsx` + `hooks/useOAuthCallback.js` |
| Pedidos a la API | `services/authService.js` (`oauthUrlRequest`, `oauthCallbackRequest`) |
| Claves y URL de retorno | `api/.env` (guía en el README) y `api/src/oauth/redirectUri.js` (cada red puede tener su `<RED>_REDIRECT_BASE`) |
| Un proveedor en particular | `api/src/oauth/providers/<proveedor>.js` |
| Alta, vinculación o ingreso del usuario | `api/src/services/oauth/resolveUser.js` |
| Tabla de cuentas de redes | `identidades_oauth` en `api/database/schema.sql` |

## Endpoints (todos POST)

- `/api/auth/registro`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/sesion`, `/api/auth/perfil`
- `/api/auth/oauth/proveedores`, `/api/auth/oauth/url`, `/api/auth/oauth/callback`
- `/api/usuarios/listar`, `/api/usuarios/crear`, `/api/usuarios/actualizar`, `/api/usuarios/eliminar` (solo administrador)
