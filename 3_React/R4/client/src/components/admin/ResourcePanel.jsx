import { useEffect, useState } from 'react'
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import { api } from '../../services/api.js'

export function ResourcePanel({ resource, config }) {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(null)
  const [status, setStatus] = useState({ loading: true, message: '', error: '' })
  const [deleteId, setDeleteId] = useState(null)

  const load = async () => {
    setStatus((current) => ({ ...current, loading: true, error: '' }))
    try {
      const result = await api.list(resource)
      setItems(result.items); setStatus({ loading: false, message: '', error: '' })
    } catch (error) { setStatus({ loading: false, message: '', error: error.message }) }
  }
  useEffect(() => { load() }, [resource])

  const edit = (item) => setForm({ ...item, tecnologias: item.tecnologias || '' })
  const updateField = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }
  const save = async (event) => {
    event.preventDefault(); setStatus((current) => ({ ...current, error: '', message: '' }))
    try {
      const response = form.id ? await api.update(resource, form) : await api.create(resource, form)
      setForm(null); await load(); setStatus({ loading: false, message: response.message, error: '' })
    } catch (error) { setStatus((current) => ({ ...current, error: error.message })) }
  }
  const remove = async () => {
    try {
      const response = await api.remove(resource, deleteId)
      setDeleteId(null); await load(); setStatus({ loading: false, message: response.message, error: '' })
    } catch (error) { setStatus((current) => ({ ...current, error: error.message })) }
  }

  return (
    <section className="admin-panel-card">
      <div className="panel-heading"><div><p className="eyebrow">Contenido</p><h2>{config.label}</h2></div><button className="button button-primary button-small" onClick={() => setForm({ ...config.empty })}><Plus /> Nuevo</button></div>
      {status.message ? <p className="form-status success" role="status">{status.message}</p> : null}
      {status.error ? <p className="form-status error" role="alert">{status.error}</p> : null}
      {form ? <form className="resource-form" onSubmit={save}>
        <div className="form-title"><h3>{form.id ? 'Editar registro' : 'Nuevo registro'}</h3><button type="button" className="icon-button" onClick={() => setForm(null)} aria-label="Cerrar formulario"><X /></button></div>
        <div className="admin-form-grid">{config.fields.map((field) => <AdminField key={field.name} field={field} value={form[field.name]} onChange={updateField} />)}</div>
        <button className="button button-primary" type="submit"><Save /> Guardar cambios</button>
      </form> : null}
      {status.loading ? <p className="muted">Cargando…</p> : items.length === 0 ? <div className="empty-state">Todavía no hay registros.</div> : <div className="admin-list">{items.map((item) => <article key={item.id}><div><strong>{item.titulo || item.nombre}</strong><p>{item.resumen || item.descripcion || item.categoria || item.url || item.imagen_url}</p></div><div className="row-actions"><button onClick={() => edit(item)} aria-label="Editar"><Edit3 /></button><button className="danger" onClick={() => setDeleteId(item.id)} aria-label="Eliminar"><Trash2 /></button></div></article>)}</div>}
      {deleteId ? <div className="confirm-bar" role="alert"><p>¿Eliminar este registro? Esta acción no se puede deshacer.</p><button className="button button-danger button-small" onClick={remove}>Sí, eliminar</button><button className="button button-ghost button-small" onClick={() => setDeleteId(null)}>Cancelar</button></div> : null}
    </section>
  )
}

function AdminField({ field, value, onChange }) {
  if (field.type === 'checkbox') return <label className="checkbox-field"><input name={field.name} type="checkbox" checked={Boolean(value)} onChange={onChange} /><span>{field.label}</span></label>
  const props = { name: field.name, value: value ?? '', onChange, required: !['demo_url', 'repo_url', 'cv_url'].includes(field.name) }
  return <label className={field.type === 'textarea' ? 'field field-wide' : 'field'}><span>{field.label}</span>{field.type === 'textarea' ? <textarea {...props} rows="4" /> : <input {...props} type={field.type} min={field.type === 'number' ? 0 : undefined} />}</label>
}
