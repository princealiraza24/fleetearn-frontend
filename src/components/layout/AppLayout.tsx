import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MobileNav from './MobileNav'
import { useAuthStore } from '@/stores/authStore'

export default function AppLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60">
        <Topbar />
        <main className="flex-1 p-9 pb-24 md:pb-9">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
