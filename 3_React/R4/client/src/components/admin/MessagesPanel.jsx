import { useEffect, useState } from 'react'
import { Check, Mail, MailOpen, Trash2 } from 'lucide-react'
import { api } from '../../services/api.js'

export function MessagesPanel() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  // cargo los mensajes desde la API
  const load = async () => {
    try {
      const data = await api.list('mensajes')
      setItems(data.items)
      setError('')
    } catch (failure) {
      setError(failure.message)
    }
  }

  useEffect(() => { load() }, [])

  const toggle = async (item) => {
    try {
      await api.markMessage(item.id, !item.leido)
      await load()
    } catch (failure) {
      setError(failure.message)
    }
  }

  const remove = async (id) => {
    try {
      await api.remove('mensajes', id)
      await load()
    } catch (failure) {
      setError(failure.message)
    }
  }

  const unread = items.filter((item) => !item.leido).length

  return (
    <section className="admin-panel-card">
      <div className="panel-heading">
        <div><p className="eyebrow">Bandeja</p><h2>Mensajes</h2></div>
        <span className="message-count">{unread} sin leer</span>
      </div>
      {error ? <p className="form-status error" role="alert">{error}</p> : null}
      {items.length === 0 ? <div className="empty-state">No hay mensajes todavía.</div> : (
        <div className="message-list">
          {items.map((item) => <MessageItem key={item.id} item={item} onToggle={toggle} onRemove={remove} />)}
        </div>
      )}
    </section>
  )
}

function MessageItem({ item, onToggle, onRemove }) {
  return (
    <article className={item.leido ? 'is-read' : ''}>
      <div className="message-icon">{item.leido ? <MailOpen /> : <Mail />}</div>
      <div className="message-body">
        <div><strong>{item.nombre}</strong><span>{new Date(item.recibido_en).toLocaleString('es-AR')}</span></div>
        <a href={`mailto:${item.email}`}>{item.email}</a>
        <h3>{item.asunto}</h3>
        <p>{item.mensaje}</p>
      </div>
      <div className="row-actions">
        <button onClick={() => onToggle(item)} title={item.leido ? 'Marcar sin leer' : 'Marcar leído'} aria-label={item.leido ? 'Marcar sin leer' : 'Marcar leído'}>{item.leido ? <Mail /> : <Check />}</button>
        <button className="danger" onClick={() => onRemove(item.id)} title="Eliminar" aria-label="Eliminar mensaje"><Trash2 /></button>
      </div>
    </article>
  )
}
