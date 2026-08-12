import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function PublicRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-graphite-200 border-t-signal-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Redirect authenticated users away from public routes (like login/signup)
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
