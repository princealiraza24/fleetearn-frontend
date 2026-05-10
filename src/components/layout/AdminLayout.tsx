import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'
import { usePendingDeposits, usePendingWithdrawals } from '@/hooks/useAdmin'
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle,
  Users, Settings, LogOut, ChevronRight
} from 'lucide-react'

export default function AdminLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const logout = useLogout()
  const fullName = useAuthStore(s => s.fullName) ?? 'Admin'

  const { data: deposits }    = usePendingDeposits()
  const { data: withdrawals } = usePendingWithdrawals()

  const pendingDep = deposits?.length    ?? 0
  const pendingWit = withdrawals?.length ?? 0

  if (!isAuthenticated) return <Navigate to="/login" replace />

  const navItems = [
    { to: '/admin',             label: 'Overview',    icon: LayoutDashboard, exact: true  },
    { to: '/admin/deposits',    label: 'Deposits',    icon: ArrowDownCircle, badge: pendingDep  },
    { to: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpCircle,   badge: pendingWit  },
    { to: '/admin/users',       label: 'Users',       icon: Users            },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-56 flex flex-col z-50"
        style={{ background: '#070d07', borderRight: '1px solid var(--border)' }}>

        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <p className="font-syne font-extrabold text-lg">
            Fleet<span style={{ color: 'var(--green)' }}>Earn</span>
          </p>
          <p className="text-xs mt-0.5 font-semibold tracking-widest uppercase"
            style={{ color: 'var(--green)' }}>Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                  isActive ? 'border' : 'border border-transparent'
                }`
              }
              style={({ isActive }) => isActive
                ? { background: 'var(--faint)', color: 'var(--green)', borderColor: 'var(--border)' }
                : { color: 'var(--muted2)' }
              }
            >
              <item.icon size={16} />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--green)', color: '#000' }}>
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        {/* Back to app + logout */}
        <div className="p-3 space-y-1.5">
          <NavLink to="/dashboard"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs transition-all"
            style={{ color: 'var(--muted2)', border: '1px solid var(--border)' }}>
            <ChevronRight size={13} />
            Back to App
          </NavLink>
          <button onClick={logout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs w-full transition-all"
            style={{ color: 'var(--muted2)', border: '1px solid var(--border)' }}>
            <LogOut size={13} />
            Logout
          </button>
          <div className="px-3 py-2 rounded-xl text-xs"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="font-medium truncate">{fullName}</p>
            <p style={{ color: 'var(--green)' }}>Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col ml-56">
        <header className="sticky top-0 z-40 px-8 py-4 flex items-center gap-3"
          style={{
            background: 'rgba(7,9,8,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)'
          }}>
          <div className="flex items-center gap-2">
            {(pendingDep + pendingWit) > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium animate-pulse"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316' }}>
                ⚠️ {pendingDep + pendingWit} actions pending
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs" style={{ color: 'var(--muted2)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} />
            System Online
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
