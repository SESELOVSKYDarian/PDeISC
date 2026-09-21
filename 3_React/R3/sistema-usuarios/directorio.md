# Directorio del proyecto

Sistema de usuarios con React + API Express + MySQL. Hay **dos sistemas independientes** (cada uno con su propio código, sus dependencias y su `package.json`) que usan la misma API y la misma base de datos:

| Sistema | Carpeta | Puerto | Cómo cambia de pantalla |
|---|---|---|---|
| Con `useState` | `cliente-usestate/` | 5173 | estado (`user`, `mode`) en `App.jsx`, sin Router |
| Con React Router | `cliente-router/` | 5174 | rutas `/ingresar`, `/registro`, `/`, `/usuarios` |
| API + BBDD | `api/` | 4000 | — |

Todo junto: `npm run dev` en la raíz (usa `concurrently`). Primera vez: `npm run seed` (crea tablas y el administrador del `.env`).

## api/

```
api/
├── database/
│   ├── schema.sql        tablas roles y usuarios (3FN)
│   ├── init.js           crea las tablas
│   └── seed-admin.js     crea la BBDD, las tablas y el primer administrador
└── src/
    ├── server.js         arranca el servidor
    ├── app.js            arma Express (helmet, cors, rutas, errores)
    ├── config.js         variables del .env
    ├── routes/           auth.routes.js, users.routes.js (solo POST)
    ├── controllers/
    │   ├── auth/         register, login, logout, session, updateProfile
    │   └── users/        list, create, update, remove (solo administrador)
    ├── services/
    │   ├── db.js         conexión MySQL
    │   └── users/        una consulta SQL por archivo (parametrizadas)
    ├── middleware/       requireAuth, requireAdmin, rateLimiters, ensureBody, errorHandlers
    ├── validators/       reglas de nombre, email, contraseña y usuario
    └── utils/            passwords (bcrypt), token (JWT), cookies, toId
```

## Clientes (misma estructura en los dos)

```
src/
├── main.jsx, App.jsx     arranque y pantallas (App.jsx cambia según el sistema)
├── context/              AuthContext (sesión), ThemeContext (tema en localStorage)
├── services/             api.js (Axios), authService.js, usersService.js
├── hooks/                useUsers, useAuthRequest, useScrollTop
├── validation/           reglas de useForm: nombre, email, contraseña
├── utils/                formatDate (DD/MM/AA), initials, onlyLetters
├── lib/utils.js          helper cn() de shadcn
├── styles/
│   ├── base.css, index.css   colores, reset y entrada de estilos del login/registro
│   ├── auth/                 partes del diseño del login y registro
│   └── panel.css             tema shadcn/Tailwind (solo cuando se ve un panel)
└── components/
    ├── auth/             login y registro (AuthForm y sus piezas)
    ├── admin/            panel del administrador (tabla, búsqueda, modales)
    ├── profile/          panel del usuario común (bienvenida + editar perfil)
    ├── common/           marco de los paneles, logout con confirmación, botón de subir
    └── ui/               componentes shadcn/ui
```

Solo en `cliente-router/`: `pages/` (AuthPage, HomePage, UsersPage), `components/guards/` (PrivateRoute, AdminRoute), `components/layout/AppLayout.jsx` y `utils/homePath.js`.

## Cómo cumple la consigna

| Pide la consigna | Dónde está |
|---|---|
| Conectar a una BBDD SQL con los usuarios | `api/src/services/db.js` + `api/database/schema.sql` (MySQL, tablas `roles` y `usuarios`, 3FN) |
| `useState` | estado de pantalla en `cliente-usestate/src/App.jsx`; formularios, modales y listas en los dos |
| `useEffect` | `AuthContext` (pide la sesión al abrir), `useUsers` (carga la lista), `useScrollTop`, `ThemeContext` |
| `useForm` | `AuthForm`, `ProfileForm`, `UserFormDialog` (reglas en `validation/`) |
| `localStorage` | `ThemeContext`: guarda el tema claro/oscuro (`usuarios-theme` / `usuarios-router-theme`) |
| Context | `AuthContext` y `ThemeContext` |
| React Router | `cliente-router/` (`App.jsx`, `pages/`, `guards/`) |
| API + React, Axios | `services/api.js` (Axios) llama a los endpoints de `api/` |
| Un sistema con Router y otro con useState | `cliente-router/` y `cliente-usestate/`, independientes |
| Persistencia | usuarios en MySQL; la sesión sigue activa 8 h con una cookie; el tema queda en localStorage |
| Protección de datos | contraseñas con bcrypt; sesión en cookie `httpOnly`; consultas parametrizadas; validación en el backend; rol leído de la BBDD en cada pedido; `helmet`; límite de intentos de login; secretos en `.env` (fuera de git); todos los endpoints son POST |

## Endpoints (todos POST)

- `/api/auth/registro`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/sesion`, `/api/auth/perfil`
- `/api/usuarios/listar`, `/api/usuarios/crear`, `/api/usuarios/actualizar`, `/api/usuarios/eliminar` (solo administrador)
