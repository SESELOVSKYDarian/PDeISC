export const resourceConfigs = {
  'categorias-habilidades': {
    label: 'Categorías', empty: { nombre: '', imagen_url: '', orden: 0 },
    fields: [field('nombre', 'Nombre'), field('imagen_url', 'URL o ruta de imagen'), field('orden', 'Orden', 'number')]
  },
  experiencias: {
    label: 'Experiencias', empty: { titulo: '', organizacion: '', periodo: '', descripcion: '', orden: 0 },
    fields: [field('titulo', 'Título'), field('organizacion', 'Organización'), field('periodo', 'Período'), field('descripcion', 'Descripción', 'textarea'), field('orden', 'Orden', 'number')]
  },
  logros: {
    label: 'Logros', empty: { titulo: '', descripcion: '', fecha: '', orden: 0 },
    fields: [field('titulo', 'Título'), field('fecha', 'Fecha'), field('descripcion', 'Descripción', 'textarea'), field('orden', 'Orden', 'number')]
  },
  'enlaces-sociales': {
    label: 'Enlaces', empty: { nombre: '', url: '', orden: 0 },
    fields: [field('nombre', 'Nombre'), field('url', 'URL', 'url'), field('orden', 'Orden', 'number')]
  },
  proyectos: {
    label: 'Proyectos', empty: { titulo: '', resumen: '', descripcion: '', imagen_url: '', demo_url: '', repo_url: '', tecnologias: '', destacado: true, orden: 0 },
    fields: [field('titulo', 'Título'), field('resumen', 'Resumen'), field('descripcion', 'Descripción', 'textarea'), field('imagen_url', 'URL o ruta de imagen'), field('demo_url', 'URL de demo', 'url'), field('repo_url', 'URL del repositorio', 'url'), field('tecnologias', 'Tecnologías separadas por coma'), field('destacado', 'Proyecto destacado', 'checkbox'), field('orden', 'Orden', 'number')]
  }
}

function field(name, label, type = 'text') { return { name, label, type } }

export const profileFields = [
  field('nombre', 'Nombre'), field('rol', 'Rol profesional'), field('saludo', 'Saludo'), field('presentacion', 'Presentación', 'textarea'),
  field('descripcion', 'Descripción extensa', 'textarea'), field('ubicacion', 'Ubicación'), field('email', 'Correo', 'email'),
  field('disponibilidad', 'Disponibilidad'), field('retrato_url', 'URL del retrato'), field('cv_url', 'URL del CV')
]
