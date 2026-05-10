import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calculator, Wallet, Link2, User } from 'lucide-react'

const items = [
  { label: 'Home',       to: '/dashboard',  icon: LayoutDashboard },
  { label: 'Calculator', to: '/calculator', icon: Calculator },
  { label: 'Wallet',     to: '/deposit',    icon: Wallet },
  { label: 'Referrals',  to: '/referrals',  icon: Link2 },
  { label: 'Profile',    to: '/profile',    icon: User },
]

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 pb-safe"
      style={{ background: 'var(--black2)', borderTop: '1px solid var(--border)' }}>
      <div className="flex justify-around py-2">
        {items.map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive ? '' : 'opacity-50'
              }`
            }
            style={({ isActive }) => ({ color: isActive ? 'var(--green)' : 'var(--muted2)' })}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
