export const originalNodes = [
  {
    id: 'node-1',
    tag: 'a',
    label: 'Enlace',
    text: 'Visitar MDN',
    attributes: {
      href: 'https://developer.mozilla.org',
      title: 'Documentacion web',
      target: '_blank',
      rel: 'noreferrer'
    }
  },
  {
    id: 'node-2',
    tag: 'img',
    label: 'Imagen',
    text: '',
    attributes: {
      src: 'https://picsum.photos/seed/atributos-1/320/180',
      alt: 'Imagen original',
      width: '320',
      height: '180'
    }
  },
  {
    id: 'node-3',
    tag: 'input',
    label: 'Input',
    text: '',
    attributes: {
      type: 'text',
      value: 'Texto inicial',
      placeholder: 'Escribe aqui'
    }
  },
  {
    id: 'node-4',
    tag: 'button',
    label: 'Boton',
    text: 'Boton original',
    attributes: {
      type: 'button',
      title: 'Boton sin cambios'
    }
  },
  {
    id: 'node-5',
    tag: 'div',
    label: 'Caja',
    text: 'Caja informativa',
    attributes: {
      title: 'Caja original',
      'data-state': 'original'
    }
  }
];

export const updatedNodes = {
  'node-1': {
    text: 'Abrir OpenAI',
    attributes: {
      href: 'https://openai.com',
      title: 'Sitio actualizado'
    }
  },
  'node-2': {
    attributes: {
      src: 'https://picsum.photos/seed/atributos-2/320/180',
      alt: 'Imagen modificada'
    }
  },
  'node-3': {
    attributes: {
      value: 'Texto actualizado',
      placeholder: 'Atributo modificado'
    }
  },
  'node-4': {
    text: 'Boton actualizado',
    attributes: {
      title: 'Boton modificado',
      'data-mode': 'updated'
    }
  },
  'node-5': {
    text: 'Caja con atributos modificados',
    attributes: {
      title: 'Caja actualizada',
      'data-state': 'updated'
    }
  }
};
