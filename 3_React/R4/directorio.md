# Directorio del proyecto

```text
R4/
├── client/                  interfaz React
│   ├── public/              retrato y portadas reemplazables
│   └── src/
│       ├── components/
│       │   ├── public/      secciones de la página pública
│       │   └── admin/       login, paneles, formularios y CRUD
│       ├── context/         tema claro/oscuro
│       ├── hooks/           datos, scroll, secciones y animaciones
│       ├── pages/           PortfolioPage y AdminPage
│       ├── services/        cliente HTTP centralizado
│       ├── styles/          CSS atomizado; index.css solo importa los archivos
│       │   ├── tokens.css   colores y tema claro/oscuro
│       │   ├── base.css     reset y elementos base
│       │   ├── layout.css, buttons.css, forms.css, states.css   piezas compartidas
│       │   ├── header.css, hero.css, about.css, skills-modal.css   portfolio público
│       │   ├── projects.css, experience.css, contact.css, cards.css
│       │   ├── admin-login.css, admin.css, admin-messages.css      panel privado
│       │   └── animations.css   keyframes y prefers-reduced-motion
│       └── utils/           validación del formulario
├── api/
│   ├── database/
│   │   ├── schema.sql       tablas, relaciones, claves e índices
│   │   ├── init.js          crea la base y aplica el esquema
│   │   └── seed.js          administrador y contenido inicial
│   └── src/
│       ├── middleware/      sesión y manejo de errores
│       ├── routes/          portfolio, contacto, auth y administración
│       ├── services/        pool y consultas MySQL
│       ├── utils/           limpieza y validación backend
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
- `perfil`: información única de presentación.
- `enlaces_sociales`, `habilidades`, `experiencias`, `logros`: colecciones ordenables.
- `proyectos` y `tecnologias`: relación muchos a muchos mediante `proyecto_tecnologias`.
- `mensajes`: consultas recibidas desde el formulario.

La separación de tecnologías y su tabla intermedia evita repetición y mantiene la base en 3FN.
