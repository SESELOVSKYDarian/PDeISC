# Directorio del proyecto

```text
R4/
├── client/                  interfaz React
│   ├── public/              retrato y portadas reemplazables
│   └── src/
│       ├── components/
│       │   ├── public/      secciones de la página pública
│       │   └── admin/       login, paneles, modales, filas arrastrables y campos de archivo
│       ├── context/         tema claro/oscuro
│       ├── hooks/           datos, scroll, secciones, animaciones, favicon y listas del panel (useResource)
│       ├── pages/           PortfolioPage y AdminPage
│       ├── services/        cliente HTTP centralizado
│       ├── styles/          CSS atomizado; index.css solo importa los archivos
│       │   ├── tokens.css   colores y tema claro/oscuro
│       │   ├── base.css     reset y elementos base
│       │   ├── layout.css, buttons.css, forms.css, states.css   piezas compartidas
│       │   ├── header.css, hero.css, about.css, skills-modal.css   portfolio público
│       │   ├── projects.css, experience.css, contact.css, cards.css
│       │   ├── admin-login.css, admin.css, admin-messages.css, file-field.css, admin-modal.css   panel privado (modales, subida de archivos, filas arrastrables)
│       │   └── animations.css   keyframes y prefers-reduced-motion
│       └── utils/           validación del formulario y de archivos (fileRules.js)
├── api/
│   ├── database/
│   │   ├── schema.sql       tablas, relaciones, claves e índices
│   │   ├── init.js          crea la base y aplica el esquema
│   │   └── seed.js          administrador y contenido inicial
│   └── src/
│       ├── middleware/      sesión y manejo de errores
│       ├── routes/          portfolio, contacto, auth, administración, upload (subida) y files (descarga)
│       ├── services/        pool y consultas MySQL (files.js: archivos subidos)
│       ├── utils/           limpieza y validación backend (fileTypes.js: formatos permitidos)
│       ├── app.js           configuración de Express
│       ├── config.js        variables de entorno
│       └── server.js        inicio del servidor
├── Dockerfile               build y ejecución en EasyPanel
├── package.json             comandos para todo el proyecto
└── README.md                instalación, uso y despliegue
```

## Flujo de datos

1. React envía una petición `POST` al servicio de API.
2. La ruta valida y limpia los datos.
3. El servicio ejecuta consultas parametrizadas sobre MySQL.
4. La API responde JSON y React actualiza el estado y la pantalla.
5. El portfolio público vuelve a leer la información actualizada al recargar.

## Base de datos

- `administradores`: acceso al panel, con hash de contraseña.
- `perfil`: información única de presentación (retrato, CV y favicon).
- `enlaces_sociales`, `habilidades`, `experiencias`, `logros`: colecciones ordenables.
- `proyectos` y `tecnologias`: relación muchos a muchos mediante `proyecto_tecnologias`.
- `mensajes`: consultas recibidas desde el formulario.
- `archivos`: imágenes y PDF subidos desde el panel (contenido en `LONGBLOB`). Los campos `retrato_url`, `cv_url` e `imagen_url` guardan la dirección `/archivos/<id>`.

## Panel: listas, modales y orden

- `ResourcePanel.jsx` arma cada lista (proyectos, categorías, habilidades, experiencias, logros y enlaces) a partir de `resourceConfigs.js`, que dice qué campos tiene cada una.
- Crear y editar abren un modal (`ResourceFormModal.jsx` sobre `AdminModal.jsx`); eliminar pide confirmación en otro modal (`ConfirmDialog.jsx`).
- El orden ya no se escribe: se arrastra la fila desde el ícono ⋮⋮ (`SortableList.jsx`, con `@dnd-kit`; también funciona con teclado y con el dedo). Las habilidades se ordenan dentro de su categoría.
- Al soltar, el cliente llama a `POST /api/admin/<recurso>/ordenar` con los ids en el orden nuevo (`api/src/routes/order.routes.js`). Los registros nuevos se agregan al final y editar nunca cambia el lugar.
- Imágenes que se usan en el sitio, todas subibles desde el panel: retrato (Perfil), imagen de cada proyecto, imagen de cada categoría y el favicon (Perfil).

## Subida de archivos

1. `FileField.jsx` valida formato y tamaño apenas se elige el archivo (`utils/fileRules.js`).
2. `POST /api/admin/archivos/subir` (solo con sesión) recibe el archivo en base64 y lo vuelve a validar mirando los primeros bytes, no el nombre.
3. Se guarda en `archivos` y se devuelve `/archivos/<id>`, que el formulario guarda en su campo.
4. `/archivos/<id>` sirve el archivo con su tipo real. Es la única ruta `GET` de la API: la necesitan `<img>` y el enlace de descarga del CV.
5. Los archivos que ningún registro usa se borran solos (con una hora de margen) en la siguiente subida.

Permitido: imágenes JPG, PNG, WEBP y GIF (hasta 5 MB), favicon en PNG, ICO, JPG, WEBP o GIF (hasta 1 MB) y currículum en PDF (hasta 10 MB). SVG no se acepta a propósito, porque puede llevar scripts.

La separación de tecnologías y su tabla intermedia evita repetición y mantiene la base en 3FN.
