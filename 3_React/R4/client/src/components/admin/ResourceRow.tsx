import { Edit3, Trash2 } from 'lucide-react'
import type { ResourceConfig, ResourceItem } from '../../types/admin'

interface ResourceRowProps {
  item: ResourceItem;
  config: ResourceConfig;
  onEdit: (item: ResourceItem) => void;
  onDelete: (item: ResourceItem) => void;
}

// contenido de una fila de la lista: miniatura, textos y botones
export function ResourceRow({ item, config, onEdit, onDelete }: ResourceRowProps) {
  const subtitle = config.subtitle ? config.subtitle(item) : (item.resumen || item.descripcion || item.url) as string | undefined
  const title = (item.titulo || item.nombre) as string

  return (
    <>
      <div className="row-main">
        {item.imagen_url ? <img className="row-thumb" src={item.imagen_url as string} alt="" loading="lazy" /> : null}
        <div className="row-text">
          <strong>{title}</strong>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="row-actions">
        <button type="button" onClick={() => onEdit(item)} aria-label={`Editar ${title}`}><Edit3 /></button>
        <button type="button" className="danger" onClick={() => onDelete(item)} aria-label={`Eliminar ${title}`}><Trash2 /></button>
      </div>
    </>
  )
}
