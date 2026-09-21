import { useEffect, useState } from 'react'

export function useScrollTop(limit = 600) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > limit)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [limit])
  return visible
}
