// contenido inicial del portfolio (se puede editar después desde el panel)

export const profile = {
  nombre: 'Darian',
  rol: 'Desarrollador Full Stack',
  saludo: 'Hola, soy',
  presentacion: 'No simplemente creo webs, sino experiencias modernas, claras e interactivas para los usuarios.',
  descripcion: 'Soy estudiante de desarrollo y construyo productos digitales combinando código simple, diseño cuidado y aprendizaje constante.',
  ubicacion: 'Buenos Aires, Argentina',
  email: 'tu-email@ejemplo.com',
  disponibilidad: 'Disponible para nuevos proyectos',
  retrato_url: '/portrait-placeholder.svg',
  cv_url: ''
}

export const categories = [
  { nombre: 'Frontend', imagen_url: '/project-portfolio.svg' },
  { nombre: 'Backend', imagen_url: '/project-users.svg' },
  { nombre: 'Datos', imagen_url: '/project-tasks.svg' },
  { nombre: 'Diseño', imagen_url: '/project-portfolio.svg' },
  { nombre: 'Herramientas', imagen_url: '/project-users.svg' }
]

export const skills = [
  { nombre: 'React', categoria: 'Frontend', nivel: 85 },
  { nombre: 'JavaScript', categoria: 'Frontend', nivel: 95 },
  { nombre: 'Node.js', categoria: 'Backend', nivel: 78 },
  { nombre: 'MySQL', categoria: 'Datos', nivel: 70 },
  { nombre: 'CSS', categoria: 'Diseño', nivel: 90 },
  { nombre: 'Git', categoria: 'Herramientas', nivel: 82 }
]

export const projects = [
  {
    titulo: 'Gammamodas',
    resumen: 'Ecommerce con React, Express y MySQL',
    descripcion: 'Tienda online desarrollada con React, Express y MySQL.',
    imagen_url: '/project-users.svg',
    demo_url: 'https://gammamodas.com.ar',
    tecnologias: ['React', 'Express', 'MySQL']
  },
  {
    titulo: 'Vase',
    resumen: 'App web de servicios con Next y PostgreSQL',
    descripcion: 'Aplicación web de servicios desarrollada con Next y PostgreSQL.',
    imagen_url: '/project-tasks.svg',
    demo_url: 'https://vase.ar',
    tecnologias: ['Next', 'PostgreSQL']
  },
  {
    titulo: 'Opensystemsoft',
    resumen: 'Landing con CSS y React',
    descripcion: 'Landing page desarrollada con CSS y React.',
    imagen_url: '/project-portfolio.svg',
    demo_url: 'https://opensystemsoft.com.ar',
    tecnologias: ['CSS', 'React']
  }
]

export const experiences = [
  {
    titulo: 'Formación en Desarrollo',
    organizacion: 'Escuela técnica',
    periodo: 'Actualidad',
    descripcion: 'Proyectos académicos con React, Node.js, APIs y bases de datos. He hecho proyectos en https://github.com/SESELOVSKYDarian/PDeISC, ahí hay varios proyectos realizados.'
  }
]

export const achievements = [
  { titulo: 'UX UI Designer', descripcion: 'Curso de Guanyar. Certificado.', fecha: '2025' },
  { titulo: 'React: De cero a experto (Hooks y MERN)', descripcion: 'Curso de React con Hooks y stack MERN.', fecha: '2024' },
  { titulo: 'ECPE Certificate', descripcion: 'Certificado de Inglés nivel C2.', fecha: '2024' }
]

export const socialLinks = [
  { nombre: 'GitHub', url: 'https://github.com/SESELOVSKYDarian' }
]
