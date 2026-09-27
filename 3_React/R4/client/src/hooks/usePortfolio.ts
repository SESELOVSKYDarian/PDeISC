import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import type { PortfolioData } from '../types/portfolio'

interface PortfolioState {
  data: PortfolioData | null;
  loading: boolean;
  error: string;
}

export function usePortfolio() {
  const [state, setState] = useState<PortfolioState>({ data: null, loading: true, error: '' })
  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const data = await api.portfolio() as PortfolioData
      setState({ data, loading: false, error: '' })
    } catch (error: any) {
      setState({ data: null, loading: false, error: error.message })
    }
  }, [])
  useEffect(() => { load() }, [load])
  return { ...state, reload: load }
}
