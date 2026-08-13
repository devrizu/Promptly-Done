import { Outlet, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../contexts/AuthContext'
import { usePushNotifications } from '../../hooks/usePushNotifications'

export function AppShell() {
  usePushNotifications()
  const { appUser } = useAuth()
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)
  
  if (appUser?.role === 'unassigned') {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar isPinned={isSidebarPinned} onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)} />
      <main className={`transition-all duration-300 p-6 lg:p-8 pt-16 lg:pt-8 ${isSidebarPinned ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Outlet />
      </main>
    </div>
  )
}
