# Portfolio R4

Portfolio full stack de una sola página con panel administrador. Está hecho con **React + Vite**, una API **Express** y una base **MySQL** normalizada en 3FN.

## Qué incluye

- Portfolio responsive con hero, perfil, habilidades, proyectos, experiencia, logros y contacto.
- Diseño claro/oscuro guardado en `localStorage`.
- Animaciones de entrada y scroll que respetan `prefers-reduced-motion`.
- Formulario de contacto real con validación en React y en la API.
- Panel privado en `/admin` con CRUD de todo el contenido y bandeja de mensajes.
- Sesión con JWT en cookie `httpOnly`, contraseña con bcrypt, rate limit, Helmet y SQL parametrizado.
- Todos los endpoints de datos usan `POST`.

## Requisitos

- Node.js 20 o superior.
- MySQL 8 o MariaDB compatible.

## Instalación local

Desde esta carpeta:

```bash
npm run install:all
```

Copiar `api/.env.example` como `api/.env` y cambiar, como mínimo, `JWT_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

Crear las tablas y cargar el contenido inicial manualmente, si se quiere preparar la base antes de iniciar:

```bash
npm run db:prepare
```

Iniciar frontend y API:

```bash
npm run dev
```

`npm run dev` también ejecuta `db:prepare` automáticamente. MySQL debe estar encendido y los datos de `api/.env` deben ser correctos.

- Portfolio: `http://localhost:5173`
- Panel: `http://localhost:5173/admin`
- API: `http://localhost:4000`

El seed usa marcadores como `Tu Nombre`: no son experiencia inventada. Después de ingresar al panel deben reemplazarse por datos reales.

## Variables de entorno

| Variable | Uso |
|---|---|
| `PORT` | Puerto de Express; por defecto `4000` |
| `NODE_ENV` | Usar `production` en EasyPanel |
| `CLIENT_URL` | Origen permitido durante desarrollo |
| `DB_HOST`, `DB_PORT` | Dirección del servicio MySQL |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Credenciales y nombre de la base |
| `JWT_SECRET` | Secreto largo para firmar sesiones |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Administrador inicial |

## Subir a EasyPanel

1. Subir el repositorio a GitHub.
2. Crear un proyecto en EasyPanel y agregar un servicio **MySQL**.
3. Crear un servicio de aplicación desde el repositorio.
4. Indicar como directorio de construcción `3_React/R4` si el repositorio contiene todos los trabajos, y seleccionar el `Dockerfile` de esa carpeta.
5. Configurar dominio y puerto interno `4000`.
6. Cargar las variables de `api/.env.example` usando el host, usuario y contraseña del servicio MySQL. En producción usar `NODE_ENV=production`.
7. Desplegar. El contenedor ejecuta la inicialización idempotente, carga el administrador y arranca la aplicación.

El volumen persistente corresponde al servicio MySQL, no al contenedor web. Los retratos e imágenes pueden ser rutas incluidas en `client/public` o URLs HTTPS externas.

## Comandos

```bash
npm run dev       # API y Vite juntos
npm run build     # build de React
npm test          # pruebas de API y cliente
npm run db:init   # crea base y tablas
npm run db:prepare # crea tablas y carga el contenido inicial
npm run seed      # crea admin y datos iniciales
npm start         # servidor de producción (requiere build previo)
```

## Entrega

Antes de entregar:

1. Reemplazar el retrato `client/public/portrait-placeholder.svg` o cambiar su URL desde el panel.
2. Completar información, enlaces, proyectos y experiencia reales.
3. Probar formulario y bandeja de mensajes.
4. Entregar el enlace de GitHub y el dominio de EasyPanel.

La estructura completa está explicada en [directorio.md](directorio.md).
