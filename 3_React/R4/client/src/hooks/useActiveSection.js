import { useEffect, useState } from 'react'

// devuelve el id de la última sección cuyo borde superior ya pasó la línea de lectura
const findActive = (ids) => {
  const line = window.innerHeight * 0.3
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  if (atBottom) return ids[ids.length - 1]
  let current = ids[0]
  for (const id of ids) {
    const element = document.getElementById(id)
    if (element && element.getBoundingClientRect().top <= line) current = id
  }
  return current
}

// ready avisa que las secciones ya están en el DOM (el portfolio carga por API)
export function useActiveSection(ids, ready) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    if (!ready) return undefined
    const update = () => setActive(findActive(ids))
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids, ready])
  return active
}
