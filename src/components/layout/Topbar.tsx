import { Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { format } from 'date-fns'

const titles: Record<string, { title: string; sub: string }> = {
  '/dashboard':    { title: "Dashboard",       sub: "Your fleet is delivering right now" },
  '/plans':        { title: "Fleet Plans",      sub: "Choose your investment plan" },
  '/calculator':   { title: "Calculator 🧮",   sub: "Calculate your exact earnings" },
  '/deposit':      { title: "Deposit Funds",    sub: "Add money to your wallet" },
  '/withdraw':     { title: "Withdraw",         sub: "Send earnings to EasyPaisa or JazzCash" },
  '/transactions': { title: "Transactions",     sub: "Your full wallet history" },
  '/referrals':    { title: "Referrals 🔗",    sub: "Earn 5% from every friend you invite" },
  '/profile':      { title: "Profile",          sub: "Manage your account" },
}

export default function Topbar() {
  const { pathname } = useLocation()
  const fullName = useAuthStore(s => s.fullName) ?? ''
  const page = titles[pathname] ?? { title: 'FleetEarn', sub: '' }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return `Good morning, ${fullName.split(' ')[0]} 👋`
    if (h < 17) return `Good afternoon, ${fullName.split(' ')[0]} 👋`
    return `Good evening, ${fullName.split(' ')[0]} 👋`
  }

  const isDash = pathname === '/dashboard'

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-9 py-5"
      style={{
        background: 'rgba(7,9,8,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)'
      }}>

      <div>
        <h1 className="font-syne font-bold text-xl tracking-tight">
          {isDash ? greeting() : page.title}
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--muted2)' }}>
          {isDash
            ? `${format(new Date(), 'EEEE, d MMM yyyy')} · ${page.sub}`
            : page.sub
          }
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium"
          style={{ background: 'var(--faint)', border: '1px solid var(--border)', color: 'var(--green)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--green)' }} />
          Fleet earning live
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--green)', border: '1.5px solid var(--black)' }} />
        </button>
      </div>
    </header>
  )
}
