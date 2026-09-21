# Sistema de usuarios

Sistema de usuarios con **React + API Express + MySQL**. Hay dos sistemas independientes que usan la misma API y la misma base de datos:

| Sistema | Carpeta | Puerto | Cómo cambia de pantalla |
|---|---|---|---|
| Con `useState` | `cliente-usestate/` | 5173 | estado en `App.jsx`, sin Router |
| Con React Router | `cliente-router/` | 5174 | rutas `/ingresar`, `/registro`, `/`, `/usuarios` |
| API + BBDD | `api/` | 4000 | endpoints POST |

Tecnologías: `useState`, `useEffect`, `useForm` (react-hook-form), `localStorage`, Context, React Router, Axios, shadcn/ui, Tailwind y Lucide Icons.

## Requisitos

- Node.js 18 o superior
- MySQL (XAMPP sirve: hay que iniciar el módulo **MySQL** en el panel de XAMPP)

## Instalación

```bash
npm install
cd api && npm install && cd ..
cd cliente-usestate && npm install && cd ..
cd cliente-router && npm install && cd ..
```

Entrá a cada carpeta antes de instalar: con `npm --prefix carpeta install` npm agrega una dependencia falsa (`file:..`) al `package.json`.

## Configuración

Copiá `api/.env.example` a `api/.env`:

```env
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=r3
JWT_SECRET=usar_un_secreto_largo_y_unico
ADMIN_EMAIL=admin@estanga.local
ADMIN_PASSWORD=Cambiar123!
```

- Con XAMPP el usuario es `root` y no tiene contraseña. Si tu MySQL tiene otra, completá `DB_PASSWORD`.
- Cambiá `JWT_SECRET` por un texto largo y propio.
- `ADMIN_EMAIL` y `ADMIN_PASSWORD` son los datos del primer administrador (la contraseña debe cumplir las reglas de abajo).
- El archivo `.env` no se sube a git.

## Puesta en marcha

1. Iniciá MySQL.
2. Creá la base, las tablas y el administrador (una sola vez):

```bash
npm run seed
```

3. Arrancá todo junto:

```bash
npm run dev
```

- API: http://localhost:4000
- Sistema useState: http://localhost:5173
- Sistema React Router: http://localhost:5174

Para ingresar como administrador usá el `ADMIN_EMAIL` y el `ADMIN_PASSWORD` de tu `.env`.

## Qué hace

**Cualquier persona**
- Se registra (siempre con rol `usuario`) o inicia sesión.
- Puede ver la contraseña con el ojo, cambiar entre modo claro y oscuro (se recuerda en `localStorage`) y ve los requisitos del registro en vivo.

**Usuario común**: una sola página con la bienvenida y su perfil. Puede cambiar nombre, correo y contraseña.

**Administrador**: una sola página, "Gestión de usuarios".
- Lista con búsqueda, rol y fecha de alta (DD/MM/AA).
- Botón "Nuevo usuario" (modal) y, por cada usuario común, iconos de editar y eliminar (con confirmación). Los administradores no se pueden editar ni borrar desde el panel.

En los dos paneles, cerrar sesión siempre pide confirmación, y al bajar en la página aparece un botón para volver arriba.

## Reglas de validación

Se validan en el formulario (useForm) y otra vez en la API:

- **Nombre:** 2 a 80 caracteres, solo letras y espacios.
- **Correo:** formato válido (con `@` y dominio, por ejemplo `.com`), hasta 120 caracteres.
- **Contraseña:** 8 a 72 caracteres, con mayúscula, minúscula, número y un carácter especial.

## Persistencia y protección de datos

- Los usuarios se guardan en MySQL (tablas `roles` y `usuarios`, en 3FN).
- La sesión dura 8 horas y vive en una cookie `httpOnly`; el tema, en `localStorage`.
- Contraseñas con **bcrypt**; consultas SQL parametrizadas; secretos en `.env`.
- La API vuelve a validar todo y lee el rol real desde la BBDD en cada pedido.
- `helmet`, límite de intentos en login (10 fallidos cada 15 minutos) y en registro, y CORS solo para los dos clientes.
- Todos los endpoints son `POST`.

## Endpoints

| Ruta | Quién |
|---|---|
| `/api/auth/registro`, `/api/auth/login`, `/api/auth/logout` | público |
| `/api/auth/sesion`, `/api/auth/perfil` | usuario con sesión |
| `/api/usuarios/listar`, `/crear`, `/actualizar`, `/eliminar` | solo administrador |

## Si algo falla

- **`Access denied for user`**: revisá `DB_USER` y `DB_PASSWORD` en `api/.env`.
- **`ECONNREFUSED 127.0.0.1:3306`**: MySQL está apagado; iniciá el módulo en XAMPP.
- **"Demasiados intentos"**: se bloquea el login por 15 minutos tras 10 intentos fallidos; reiniciá la API para levantarlo.
- Cambiaste el `.env`: reiniciá la API (no se recarga solo).

## Estructura

Está explicada en [directorio.md](directorio.md).
