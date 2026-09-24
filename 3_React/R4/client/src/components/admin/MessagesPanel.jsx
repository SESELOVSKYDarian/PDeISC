import { useEffect, useState } from 'react'
import { Check, Mail, MailOpen, Trash2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext.jsx'
import { api } from '../../services/api.js'
import { ConfirmDialog } from './ConfirmDialog.jsx'

export function MessagesPanel() {
  const PAGE_SIZE = 8
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loadError, setLoadError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [deletingAll, setDeletingAll] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, unread: 0, totalPages: 1 })

  // cargo los mensajes desde la API
  const load = async (requestedPage = page) => {
    try {
      const data = await api.list('mensajes', { page: requestedPage, limit: PAGE_SIZE })
      setItems(data.items)
      setPage(data.page)
      setPagination({ total: data.total, unread: data.unread, totalPages: data.totalPages })
      setLoadError('')
    } catch (failure) {
      setLoadError(failure.message)
    }
  }

  useEffect(() => { load(1) }, [])

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
    await load(page)
    setDeleting(null)
    toast.success(response.message)
  }

  const markAllRead = async () => {
    try {
      const response = await api.markAllMessages()
      await load(page)
      toast.success(response.message)
    } catch (failure) {
      toast.error(failure.message)
    }
  }

  const removeAll = async () => {
    const response = await api.removeAllMessages()
    setDeletingAll(false)
    await load(1)
    toast.success(response.message)
  }

  return (
    <section className="admin-panel-card">
      <div className="panel-heading">
        <div><p className="eyebrow">Bandeja</p><h2>Mensajes</h2></div>
        <span className="message-count">{pagination.unread} sin leer</span>
      </div>
      <div className="message-toolbar">
        <button className="button button-small button-ghost" type="button" onClick={markAllRead} disabled={!pagination.unread}>
          <MailOpen /> Marcar todos como leídos
        </button>
        <button className="button button-small button-danger" type="button" onClick={() => setDeletingAll(true)} disabled={!pagination.total}>
          <Trash2 /> Borrar todos los mensajes
        </button>
      </div>
      {loadError ? <p className="form-status error" role="alert">{loadError}</p> : null}
      {items.length === 0 ? <div className="empty-state">No hay mensajes todavía.</div> : (
        <div className="message-list">
          {items.map((item) => <MessageItem key={item.id} item={item} onToggle={toggle} onRemove={setDeleting} />)}
        </div>
      )}
      {pagination.totalPages > 1 ? (
        <nav className="message-pagination" aria-label="Paginación de mensajes">
          <button className="button button-small button-ghost" type="button" onClick={() => load(page - 1)} disabled={page === 1}>Anterior</button>
          <span>Página {page} de {pagination.totalPages}</span>
          <button className="button button-small button-ghost" type="button" onClick={() => load(page + 1)} disabled={page === pagination.totalPages}>Siguiente</button>
        </nav>
      ) : null}
      {deleting ? (
        <ConfirmDialog
          title="Eliminar mensaje"
          message={`¿Eliminar el mensaje de «${deleting.nombre}»? Esta acción no se puede deshacer.`}
          onConfirm={remove}
          onClose={() => setDeleting(null)}
        />
      ) : null}
      {deletingAll ? (
        <ConfirmDialog
          title="Borrar todos los mensajes"
          message="¿Querés borrar todos los mensajes? Esta acción no se puede deshacer."
          confirmLabel="Sí, borrar todos"
          onConfirm={removeAll}
          onClose={() => setDeletingAll(false)}
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
