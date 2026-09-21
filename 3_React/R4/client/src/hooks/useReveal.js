import { useEffect } from 'react'

export function useReveal(dependency) {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [dependency])
}
