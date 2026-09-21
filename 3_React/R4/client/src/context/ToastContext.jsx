import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Toaster } from '../components/common/Toaster.jsx'

const ToastContext = createContext(null)

const MAX_TOASTS = 3
const DURATIONS = { success: 4000, error: 6000 }

// avisos que aparecen abajo al centro y se van solos; se usan con useToast()
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const lastId = useRef(0)

  const close = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])

  const show = useCallback((type, message) => {
    lastId.current += 1
    const toast = { id: lastId.current, type, message, duration: DURATIONS[type] }
    setToasts((current) => [...current.slice(-(MAX_TOASTS - 1)), toast])
  }, [])

  // el objeto no cambia entre renders: quien usa useToast() no se vuelve a renderizar cuando aparece un aviso
  const toast = useMemo(() => ({ success: (message) => show('success', message), error: (message) => show('error', message) }), [show])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster toasts={toasts} onClose={close} />
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
