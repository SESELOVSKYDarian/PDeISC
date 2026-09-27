import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { Toaster } from '../components/common/Toaster'
import type { Toast, ToastApi, ToastType } from '../types/toast'

const ToastContext = createContext<ToastApi | null>(null)

const MAX_TOASTS = 3
const DURATIONS: Record<ToastType, number> = { success: 4000, error: 6000 }

// avisos que aparecen abajo al centro y se van solos; se usan con useToast()
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const lastId = useRef(0)

  const close = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), [])

  const show = useCallback((type: ToastType, message: string) => {
    lastId.current += 1
    const toast: Toast = { id: lastId.current, type, message, duration: DURATIONS[type] }
    setToasts((current) => [...current.slice(-(MAX_TOASTS - 1)), toast])
  }, [])

  // el objeto no cambia entre renders: quien usa useToast() no se vuelve a renderizar cuando aparece un aviso
  const toast = useMemo<ToastApi>(() => ({ success: (message) => show('success', message), error: (message) => show('error', message) }), [show])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster toasts={toasts} onClose={close} />
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastApi => useContext(ToastContext)!
