import { NavLink } from 'react-router-dom'
import { useLogout } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import {
  LayoutDashboard, Truck, Calculator, Wallet,
  ArrowDownCircle, ArrowUpCircle, ClipboardList,
  Link2, User, LogOut, Shield
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',    to: '/dashboard',   icon: LayoutDashboard },
  { label: 'Fleet Plans',  to: '/plans',        icon: Truck },
  { label: 'Calculator',   to: '/calculator',   icon: Calculator },
]
const walletItems = [
  { label: 'Deposit',      to: '/deposit',      icon: ArrowDownCircle },
  { label: 'Withdraw',     to: '/withdraw',     icon: ArrowUpCircle },
  { label: 'Transactions', to: '/transactions', icon: ClipboardList },
]
const growthItems = [
  { label: 'Referrals',    to: '/referrals',    icon: Link2 },
  { label: 'Profile',      to: '/profile',      icon: User },
]

export default function Sidebar() {
  const fullName = useAuthStore(s => s.fullName) ?? 'User'
  const email    = useAuthStore(s => s.email)    ?? ''
  const logout   = useLogout()
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  // Show admin link — in production check role from JWT
  const isAdmin  = email.includes('admin') || email === 'admin@fleetearn.pk'

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 flex flex-col z-50"
      style={{ background: 'var(--black2)', borderRight: '1px solid var(--border)' }}>

      <div className="px-6 py-7 font-syne font-extrabold text-xl tracking-tight"
        style={{ borderBottom: '1px solid var(--border)' }}>
        Fleet<span style={{ color: 'var(--green)' }}>Earn</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <SidebarSection label="Main"   items={navItems} />
        <SidebarSection label="Wallet" items={walletItems} />
        <SidebarSection label="Growth" items={growthItems} />

        {isAdmin && (
          <>
            <p className="px-4 pt-5 pb-2 text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--muted)' }}>Admin</p>
            <NavLink to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-4 py-[10px] rounded-xl text-sm font-medium transition-all border ${
                  isActive ? '' : 'border-transparent'}`
              }
              style={({ isActive }) => isActive
                ? { background: 'rgba(249,115,22,0.08)', color: '#f97316', borderColor: 'rgba(249,115,22,0.2)' }
                : { color: 'var(--muted2)' }
              }>
              <Shield size={16} />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-syne font-bold text-sm flex-shrink-0"
            style={{ background: 'var(--green)', color: '#000' }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fullName}</p>
            <p className="text-xs" style={{ color: 'var(--green)' }}>● Active Investor</p>
          </div>
          <button onClick={logout} className="p-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function SidebarSection({ label, items }: {
  label: string
  items: { label: string; to: string; icon: React.ElementType }[]
}) {
  return (
    <>
      <p className="px-4 pt-5 pb-2 text-xs font-semibold tracking-widest uppercase"
        style={{ color: 'var(--muted)' }}>
        {label}
      </p>
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 mx-2 px-4 py-[10px] rounded-xl text-sm font-medium transition-all border ${
              isActive ? '' : 'border-transparent'}`
          }
          style={({ isActive }) => isActive
            ? { background: 'var(--faint)', color: 'var(--green)', borderColor: 'var(--border)' }
            : { color: 'var(--muted2)' }
          }
        >
          <item.icon size={16} />
          {item.label}
        </NavLink>
      ))}
    </>
  )
}
