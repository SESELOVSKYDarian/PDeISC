import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api.js'

export function usePortfolio() {
  const [state, setState] = useState({ data: null, loading: true, error: '' })
  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const data = await api.portfolio()
      setState({ data, loading: false, error: '' })
    } catch (error) {
      setState({ data: null, loading: false, error: error.message })
    }
  }, [])
  useEffect(() => { load() }, [load])
  return { ...state, reload: load }
}
