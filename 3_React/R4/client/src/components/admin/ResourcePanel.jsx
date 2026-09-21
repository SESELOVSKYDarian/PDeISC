import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useFieldOptions } from '../../hooks/useFieldOptions.js'
import { useResource } from '../../hooks/useResource.js'
import { ConfirmDialog } from './ConfirmDialog.jsx'
import { ResourceFormModal } from './ResourceFormModal.jsx'
import { ResourceRow } from './ResourceRow.jsx'
import { SortableList } from './SortableList.jsx'

// agrupa la lista por un campo (por ejemplo, las habilidades por categoría); sin groupBy es un solo grupo
function groupItems(items, groupBy) {
  if (!groupBy) return [{ key: 'todos', title: '', items }]
  const groups = []
  for (const item of items) {
    let group = groups.find((entry) => entry.key === item[groupBy])
    if (!group) { group = { key: item[groupBy], title: item[groupBy], items: [] }; groups.push(group) }
    group.items.push(item)
  }
  return groups
}

// panel de una lista: crear y editar en modal, eliminar con confirmación y ordenar arrastrando
export function ResourcePanel({ resource, config }) {
  const { items, status, save, remove, reorder } = useResource(resource)
  const loadedOptions = useFieldOptions(config.fields)
  const options = loadedOptions || {}
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const missingOptions = !loadedOptions || config.fields.some((field) => field.type === 'select' && !options[field.name]?.length)

  const openNew = () => {
    const initial = { ...config.empty }
    for (const field of config.fields) if (field.type === 'select') initial[field.name] = options[field.name][0].value
    setEditing(initial)
  }
  const saveAndClose = async (form) => { await save(form); setEditing(null) }
  const removeAndClose = async () => { await remove(deleting.id); setDeleting(null) }

  // el orden nuevo de un grupo reemplaza a ese grupo sin mover a los demás
  const reorderGroup = (group, sorted) => {
    const inGroup = new Set(group.items.map((item) => item.id))
    let next = 0
    reorder(items.map((item) => (inGroup.has(item.id) ? sorted[next++] : item)), sorted.map((item) => item.id))
  }

  const groups = groupItems(items, config.groupBy)

  return (
    <section className="admin-panel-card">
      <div className="panel-heading">
        <div><p className="eyebrow">Contenido</p><h2>{config.label}</h2></div>
        <button className="button button-primary button-small" onClick={openNew} disabled={status.loading || missingOptions}><Plus /> Nuevo</button>
      </div>

      {loadedOptions && missingOptions && !status.loading ? <p className="form-status error">{config.needs}</p> : null}
      {status.error ? <p className="form-status error" role="alert">{status.error}</p> : null}
      {!status.loading && items.length > 1 ? <p className="drag-tip">Arrastrá las filas desde el ícono ⋮⋮ para cambiar el orden.</p> : null}

      {status.loading ? <p className="muted">Cargando…</p> : items.length === 0 ? <div className="empty-state">Todavía no hay registros.</div> : groups.map((group) => (
        <div key={group.key} className="list-group">
          {group.title ? <h3 className="list-group-title">{group.title}</h3> : null}
          <SortableList
            items={group.items}
            onReorder={(sorted) => reorderGroup(group, sorted)}
            renderRow={(item) => <ResourceRow item={item} config={config} onEdit={(row) => setEditing({ ...config.empty, ...row })} onDelete={setDeleting} />}
          />
        </div>
      ))}

      {editing ? <ResourceFormModal config={config} initial={editing} options={options} onSave={saveAndClose} onClose={() => setEditing(null)} /> : null}
      {deleting ? (
        <ConfirmDialog
          title={`Eliminar ${config.singular}`}
          message={`¿Eliminar «${deleting.titulo || deleting.nombre}»? Esta acción no se puede deshacer.`}
          onConfirm={removeAndClose}
          onClose={() => setDeleting(null)}
        />
      ) : null}
    </section>
  )
}
