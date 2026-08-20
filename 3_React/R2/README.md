# Mis Tareas — TP de React

Trabajo práctico de una aplicación de lista de tareas hecha con **React** y **React Router**. Es una SPA (single page application), o sea que se navega entre las páginas sin recargar el navegador.

## De qué se trata

La app permite:

- Ver un listado de tareas.
- Entrar al detalle de cada una (con título, descripción completa, fecha y estado).
- Crear una tarea nueva desde un formulario con validaciones.
- Editar una tarea existente desde su propia página de detalle.
- Eliminar una tarea (pidiendo confirmación con un modal propio, sin usar `alert`).
- Marcar una tarea como completa o incompleta.
- Cambiar entre modo claro y modo oscuro, y que la app se acuerde de esa preferencia.
- Las tareas se guardan en `localStorage`, así que no se pierden al recargar la página.

## Tecnologías utilizadas

- React 18
- React Router DOM 6
- Vite (para levantar el proyecto)
- Bootstrap 5 (grillas, navbar responsive, botones)
- CSS propio con variables para el tema claro/oscuro
- Context API (para las tareas y para el tema)
- Lucide React (iconos)
- localStorage (persistencia)

No se usa backend, base de datos, TypeScript ni Redux.

## Cómo instalar

Parado en la carpeta del proyecto:

```bash
npm install
```

## Cómo ejecutar

```bash
npm start
```

Esto levanta un servidor de desarrollo (con Vite) y muestra en la consola la URL para abrir en el navegador, generalmente `http://localhost:5173`.

También se puede usar:

```bash
npm run dev
```

que hace exactamente lo mismo (son dos alias del mismo comando).

## Cómo generar una build de producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos listos para subir a cualquier hosting estático.

## Estructura general

```txt
src/
├── components/     -> piezas reutilizables (Navbar, tarjetas, formulario, modal, etc)
├── pages/          -> las 4 páginas: Inicio, DetalleTarea, CrearTarea, NoEncontrado
├── context/        -> Context API para tareas y para el tema
├── data/           -> tareas de ejemplo iniciales
├── hooks/          -> hook para sincronizar el estado con localStorage
├── utils/          -> funciones de fecha y de validación
├── styles/         -> CSS propio (global + variables de tema claro/oscuro)
├── App.jsx         -> configuración de las rutas
└── index.jsx       -> punto de entrada de React
```

Para una explicación más detallada de cómo funciona todo (pensada para poder defender el trabajo oralmente), ver el archivo `explicacion.md`.
