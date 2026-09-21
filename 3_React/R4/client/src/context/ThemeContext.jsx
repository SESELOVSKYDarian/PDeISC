import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'portfolio-r4-theme-v1'

const initialTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])
  const value = useMemo(() => ({ theme, toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
