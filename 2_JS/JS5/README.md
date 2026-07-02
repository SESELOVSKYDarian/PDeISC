# alumnosDB en dos proyectos

Este directorio ahora contiene dos aplicaciones independientes:

- `proyecto-1-api-bbdd`: API propia con MySQL y una interfaz para cargar, listar, editar y eliminar alumnos.
- `proyecto-2-consumidor-api`: interfaz independiente que consume la API del Proyecto 1.

## Proyecto 1

Responsabilidades:

- Conecta a MySQL.
- Crea, lista, edita y elimina alumnos.
- Expone JSON real desde `POST /api/alumnos/listar`.
- Incluye una vista para ver la respuesta JSON en pantalla.

### Instalación

```bash
cd proyecto-1-api-bbdd
npm install
```

### Configuración `.env`

Copiá `.env.example` a `.env` y ajustá los datos de MySQL si hace falta:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=alumnosDB
DB_PORT=3306
PORT=3000
```

### Importar SQL

Importá `sql/alumnosDB.sql` en MySQL. Ese script:

- crea la base `alumnosDB`
- crea la tabla `alumnos`
- inserta 5 registros de ejemplo

### Ejecutar

```bash
npm run dev
```

### Probar JSON

Probá con:

- `POST http://localhost:3000/api/alumnos/listar`

La respuesta debe ser JSON.

## Proyecto 2

Responsabilidades:

- No usa MySQL.
- Consume `http://localhost:3000/api/alumnos/listar` con `POST`.
- Muestra alumnos en DOM real.
- Muestra el JSON recibido dentro de un `<pre>`.

### Instalación

```bash
cd proyecto-2-consumidor-api
npm install
```

### Ejecutar

```bash
npm run dev
```

La app corre en:

- `http://localhost:4000`

## Flujo general

1. MySQL guarda los alumnos en `alumnosDB`.
2. El Proyecto 1 lee la base y expone la información como JSON.
3. El Proyecto 2 hace `fetch` a esa API y renderiza lo recibido.

