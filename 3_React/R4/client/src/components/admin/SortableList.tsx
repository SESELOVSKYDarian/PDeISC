import type { ReactNode } from 'react'
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { dragAccessibility } from './dragTexts'
import type { ResourceItem } from '../../types/admin'

interface SortableListProps {
  items: ResourceItem[];
  onReorder: (sorted: ResourceItem[]) => void;
  renderRow: (item: ResourceItem) => ReactNode;
}

// lista que se reordena arrastrando (con mouse, dedo o teclado); avisa el nuevo orden con onReorder
export function SortableList({ items, onReorder, renderRow }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const finishDrag = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = items.findIndex((item) => item.id === active.id)
    const to = items.findIndex((item) => item.id === over.id)
    onReorder(arrayMove(items, from, to))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={finishDrag} accessibility={dragAccessibility}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="admin-list">
          {items.map((item) => <SortableRow key={item.id} id={item.id}>{renderRow(item)}</SortableRow>)}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({ id, children }: { id: number; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <article ref={setNodeRef} style={style} className={isDragging ? 'is-dragging' : undefined}>
      <button ref={setActivatorNodeRef} type="button" className="drag-handle" aria-label="Arrastrar para cambiar el orden" {...attributes} {...listeners}><GripVertical /></button>
      {children}
    </article>
  )
}
