import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardTitle, CardSub } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fmtPKR, fmtDate } from '@/lib/utils'
import { LogOut, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const fullName = useAuthStore(s => s.fullName) ?? ''
  const email    = useAuthStore(s => s.email)    ?? ''
  const logout   = useLogout()
  const { data: dash } = useDashboard()

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const copyReferral = () => {
    navigator.clipboard.writeText('https://fleetearn.pk/register?ref=FLEET-AX92')
    toast.success('Referral link copied!')
  }

  return (
    <div className="max-w-lg space-y-5">

      {/* Profile header */}
      <Card>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-syne font-extrabold text-xl"
            style={{ background: 'var(--green)', color: '#000' }}>
            {initials}
          </div>
          <div>
            <h2 className="font-syne font-bold text-xl">{fullName}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted2)' }}>{email}</p>
            <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--green)', border: '1px solid var(--border)' }}>
              ● Active Investor
            </span>
          </div>
        </div>

        {/* Stats row */}
        {dash && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Wallet',    value: fmtPKR(dash.walletBalance), green: true },
              { label: 'Invested',  value: fmtPKR(dash.totalInvested) },
              { label: 'Earned',    value: fmtPKR(dash.totalEarned),   green: true },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
                <p className="font-syne font-bold text-base"
                  style={{ color: s.green ? 'var(--green)' : 'var(--text)' }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted2)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Referral code */}
      <Card>
        <CardTitle>Referral Code</CardTitle>
        <CardSub>Share to earn 5% of every friend's first deposit</CardSub>
        <div className="mt-4 flex items-center rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}>
          <span className="flex-1 px-4 py-3 font-syne font-bold text-sm truncate"
            style={{ background: 'var(--black2)', color: 'var(--green)' }}>
            fleetearn.pk/register?ref=FLEET-AX92
          </span>
          <button onClick={copyReferral}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold flex-shrink-0"
            style={{ background: 'var(--green)', color: '#000' }}>
            <Copy size={13} /> Copy
          </button>
        </div>
      </Card>

      {/* Account details */}
      <Card>
        <CardTitle>Account Details</CardTitle>
        <div className="mt-4 space-y-0">
          {[
            { label: 'Full Name', value: fullName },
            { label: 'Email',     value: email },
            { label: 'Account Status', value: '✅ Active' },
          ].map(item => (
            <div key={item.label}
              className="flex justify-between items-center py-3"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="text-sm" style={{ color: 'var(--muted2)' }}>{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Security notice */}
      <div className="rounded-2xl p-4 text-xs leading-relaxed"
        style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
        <p className="font-semibold mb-1" style={{ color: 'var(--green)' }}>🔒 Security Tips</p>
        <p style={{ color: 'var(--muted2)' }}>
          Never share your password. FleetEarn staff will never ask for your password.
          Enable 2FA for extra security. Contact support at support@fleetearn.pk for help.
        </p>
      </div>

      {/* Logout */}
      <Button variant="danger" size="lg" onClick={logout}>
        <LogOut size={16} /> Sign Out
      </Button>
    </div>
  )
}
