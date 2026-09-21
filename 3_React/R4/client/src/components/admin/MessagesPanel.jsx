import { useEffect, useState } from 'react'
import { Check, Mail, MailOpen, Trash2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'
import { api } from '../../services/api.js'
import { ConfirmDialog } from './ConfirmDialog.jsx'

export function MessagesPanel() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loadError, setLoadError] = useState('')
  const [deleting, setDeleting] = useState(null)

  // cargo los mensajes desde la API
  const load = async () => {
    try {
      const data = await api.list('mensajes')
      setItems(data.items)
      setLoadError('')
    } catch (failure) {
      setLoadError(failure.message)
    }
  }

  useEffect(() => { load() }, [])

  const toggle = async (item) => {
    try {
      await api.markMessage(item.id, !item.leido)
      await load()
    } catch (failure) {
      toast.error(failure.message)
    }
  }

  // borrar pide confirmación; si la API falla, el error queda dentro del diálogo
  const remove = async () => {
    const response = await api.remove('mensajes', deleting.id)
    await load()
    setDeleting(null)
    toast.success(response.message)
  }

  const unread = items.filter((item) => !item.leido).length

  return (
    <section className="admin-panel-card">
      <div className="panel-heading">
        <div><p className="eyebrow">Bandeja</p><h2>Mensajes</h2></div>
        <span className="message-count">{unread} sin leer</span>
      </div>
      {loadError ? <p className="form-status error" role="alert">{loadError}</p> : null}
      {items.length === 0 ? <div className="empty-state">No hay mensajes todavía.</div> : (
        <div className="message-list">
          {items.map((item) => <MessageItem key={item.id} item={item} onToggle={toggle} onRemove={setDeleting} />)}
        </div>
      )}
      {deleting ? (
        <ConfirmDialog
          title="Eliminar mensaje"
          message={`¿Eliminar el mensaje de «${deleting.nombre}»? Esta acción no se puede deshacer.`}
          onConfirm={remove}
          onClose={() => setDeleting(null)}
        />
      ) : null}
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
        <button className="danger" onClick={() => onRemove(item)} title="Eliminar" aria-label="Eliminar mensaje"><Trash2 /></button>
      </div>
    </article>
  )
}
