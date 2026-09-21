import { Navigate, Route, Routes } from 'react-router-dom'
import { PortfolioPage } from './pages/PortfolioPage.jsx'
import { AdminPage } from './pages/AdminPage.jsx'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
