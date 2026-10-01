import { useEffect } from 'react'

// pone en la pestaña del navegador el título cargado desde el panel (si no hay, queda el de por defecto)
export function useDocumentTitle(title: string | undefined): void {
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}
