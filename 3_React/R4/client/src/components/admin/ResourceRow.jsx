import { Edit3, Trash2 } from 'lucide-react'

// contenido de una fila de la lista: miniatura, textos y botones
export function ResourceRow({ item, config, onEdit, onDelete }) {
  const subtitle = config.subtitle ? config.subtitle(item) : item.resumen || item.descripcion || item.url

  return (
    <>
      <div className="row-main">
        {item.imagen_url ? <img className="row-thumb" src={item.imagen_url} alt="" loading="lazy" /> : null}
        <div className="row-text">
          <strong>{item.titulo || item.nombre}</strong>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="row-actions">
        <button type="button" onClick={() => onEdit(item)} aria-label={`Editar ${item.titulo || item.nombre}`}><Edit3 /></button>
        <button type="button" className="danger" onClick={() => onDelete(item)} aria-label={`Eliminar ${item.titulo || item.nombre}`}><Trash2 /></button>
      </div>
    </>
  )
}
