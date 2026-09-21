import { useEffect, useState } from 'react'
import { Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import { api } from '../../services/api.js'

const emptySkill = { nombre: '', categoria_id: '', nivel: 80, orden: 0 }

export function SkillsPanel() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [status, setStatus] = useState({ loading: true, message: '', error: '' })

  const load = async () => {
    setStatus((current) => ({ ...current, loading: true, error: '' }))
    try {
      const [skillsResult, categoriesResult] = await Promise.all([api.list('habilidades'), api.list('categorias-habilidades')])
      setItems(skillsResult.items); setCategories(categoriesResult.items)
      setStatus({ loading: false, message: '', error: '' })
    } catch (error) { setStatus({ loading: false, message: '', error: error.message }) }
  }
  useEffect(() => { load() }, [])

  const save = async (event) => {
    event.preventDefault()
    try {
      const response = form.id ? await api.update('habilidades', form) : await api.create('habilidades', form)
      setForm(null); await load(); setStatus({ loading: false, message: response.message, error: '' })
    } catch (error) { setStatus((current) => ({ ...current, error: error.message, message: '' })) }
  }
  const remove = async () => {
    try {
      const response = await api.remove('habilidades', deleteId)
      setDeleteId(null); await load(); setStatus({ loading: false, message: response.message, error: '' })
    } catch (error) { setStatus((current) => ({ ...current, error: error.message, message: '' })) }
  }

  return (
    <section className="admin-panel-card">
      <div className="panel-heading"><div><p className="eyebrow">Contenido</p><h2>Habilidades</h2></div><button className="button button-primary button-small" onClick={() => setForm({ ...emptySkill, categoria_id: categories[0]?.id || '' })} disabled={!categories.length}><Plus /> Nueva</button></div>
      {!categories.length && !status.loading ? <p className="form-status error">Primero creá al menos una categoría.</p> : null}
      {status.message ? <p className="form-status success">{status.message}</p> : null}{status.error ? <p className="form-status error">{status.error}</p> : null}
      {form ? <form className="resource-form" onSubmit={save}><div className="form-title"><h3>{form.id ? 'Editar habilidad' : 'Nueva habilidad'}</h3><button type="button" className="icon-button" onClick={() => setForm(null)} aria-label="Cerrar"><X /></button></div><div className="admin-form-grid"><label className="field"><span>Nombre</span><input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} required /></label><label className="field"><span>Categoría</span><select value={form.categoria_id} onChange={(event) => setForm({ ...form, categoria_id: event.target.value })} required>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></label><label className="field"><span>Nivel</span><input type="number" min="1" max="100" value={form.nivel} onChange={(event) => setForm({ ...form, nivel: event.target.value })} required /></label><label className="field"><span>Orden</span><input type="number" min="0" value={form.orden} onChange={(event) => setForm({ ...form, orden: event.target.value })} required /></label></div><button className="button button-primary"><Save /> Guardar</button></form> : null}
      {status.loading ? <p className="muted">Cargando…</p> : <div className="admin-list">{items.map((item) => <article key={item.id}><div><strong>{item.nombre}</strong><p>{item.categoria} · {item.nivel}%</p></div><div className="row-actions"><button onClick={() => setForm({ ...item })} aria-label="Editar"><Edit3 /></button><button className="danger" onClick={() => setDeleteId(item.id)} aria-label="Eliminar"><Trash2 /></button></div></article>)}</div>}
      {deleteId ? <div className="confirm-bar"><p>¿Eliminar esta habilidad?</p><button className="button button-danger button-small" onClick={remove}>Sí, eliminar</button><button className="button button-ghost button-small" onClick={() => setDeleteId(null)}>Cancelar</button></div> : null}
    </section>
  )
}
