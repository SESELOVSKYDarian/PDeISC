import { useEffect } from 'react'

// cambia el ícono de la pestaña por el que se subió desde el panel (si no hay, queda el de por defecto)
export function useFavicon(url) {
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']")
    if (!url || !link) return
    link.removeAttribute('type')
    link.setAttribute('href', url)
  }, [url])
}
