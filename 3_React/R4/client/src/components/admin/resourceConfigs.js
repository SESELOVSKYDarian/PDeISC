// qué campos tiene cada lista del panel; el orden ya no se escribe: se cambia arrastrando las filas
export const resourceConfigs = {
  proyectos: {
    label: 'Proyectos', singular: 'proyecto',
    empty: { titulo: '', resumen: '', descripcion: '', imagen_url: '', demo_url: '', repo_url: '', tecnologias: '', destacado: true },
    fields: [
      field('titulo', 'Título'), field('resumen', 'Resumen'), field('descripcion', 'Descripción', 'textarea'),
      field('imagen_url', 'Imagen del proyecto', 'imagen'), field('demo_url', 'URL de demo', 'url', { optional: true }),
      field('repo_url', 'URL del repositorio', 'url', { optional: true }), field('tecnologias', 'Tecnologías separadas por coma'),
      field('destacado', 'Proyecto destacado', 'checkbox')
    ]
  },
  'categorias-habilidades': {
    label: 'Categorías', singular: 'categoría',
    empty: { nombre: '', imagen_url: '' },
    fields: [field('nombre', 'Nombre'), field('imagen_url', 'Imagen', 'imagen')]
  },
  habilidades: {
    label: 'Habilidades', singular: 'habilidad', groupBy: 'categoria', needs: 'Primero creá al menos una categoría.',
    subtitle: (item) => `Nivel ${item.nivel}%`,
    empty: { nombre: '', categoria_id: '', nivel: 80 },
    fields: [
      field('nombre', 'Nombre'), field('categoria_id', 'Categoría', 'select', { optionsFrom: 'categorias-habilidades' }),
      field('nivel', 'Nivel (1 a 100)', 'number', { min: 1, max: 100 })
    ]
  },
  experiencias: {
    label: 'Experiencias', singular: 'experiencia',
    empty: { titulo: '', organizacion: '', periodo: '', descripcion: '' },
    fields: [field('titulo', 'Título'), field('organizacion', 'Organización'), field('periodo', 'Período'), field('descripcion', 'Descripción', 'textarea')]
  },
  logros: {
    label: 'Logros', singular: 'logro',
    empty: { titulo: '', descripcion: '', fecha: '' },
    fields: [field('titulo', 'Título'), field('fecha', 'Fecha'), field('descripcion', 'Descripción', 'textarea')]
  },
  'enlaces-sociales': {
    label: 'Enlaces', singular: 'enlace',
    empty: { nombre: '', url: '' },
    fields: [field('nombre', 'Nombre'), field('url', 'URL', 'url')]
  }
}

function field(name, label, type = 'text', extra = {}) { return { name, label, type, ...extra } }

export const profileFields = [
  field('nombre', 'Nombre'), field('rol', 'Rol profesional'), field('saludo', 'Saludo'), field('presentacion', 'Presentación', 'textarea'),
  field('descripcion', 'Descripción extensa', 'textarea'), field('ubicacion', 'Ubicación'), field('email', 'Correo', 'email'),
  field('disponibilidad', 'Disponibilidad'), field('retrato_url', 'Retrato', 'imagen'), field('cv_url', 'Currículum (PDF)', 'cv'),
  field('favicon_url', 'Ícono de la pestaña (favicon)', 'favicon')
]
