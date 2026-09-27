import type { Announcements } from '@dnd-kit/core'

// textos en español para lectores de pantalla durante el arrastre
const name = (id: string | number) => `la fila ${id}`

const announcements: Announcements = {
  onDragStart: ({ active }) => `Levantaste ${name(active.id)}.`,
  onDragOver: ({ over }) => (over ? `Ahora está sobre ${name(over.id)}.` : 'Está fuera de la lista.'),
  onDragEnd: ({ over }) => (over ? `La soltaste sobre ${name(over.id)}.` : 'La soltaste sin cambios.'),
  onDragCancel: () => 'Cancelaste el movimiento.'
}

export const dragAccessibility = {
  screenReaderInstructions: {
    draggable: 'Para cambiar el orden, presioná espacio, movela con las flechas y presioná espacio de nuevo para soltarla. Escape cancela.'
  },
  announcements
}
