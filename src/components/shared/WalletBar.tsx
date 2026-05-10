import { fmtPKR } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

interface Props {
  walletBalance: number
  totalInvested: number
  totalEarned: number
  todayEarning: number
}

export function WalletBar({ walletBalance, totalInvested, totalEarned, todayEarning }: Props) {
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl mb-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0d1a0d, #0f200f)',
        border: '1px solid var(--border2)'
      }}>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
        style={{ '--tw-divide-opacity': 1, borderColor: 'var(--border)' } as any}>

        <div className="p-6">
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted2)' }}>Wallet Balance</p>
          <p className="font-syne font-extrabold text-2xl tracking-tight"
            style={{ color: 'var(--green)' }}>
            {fmtPKR(walletBalance)}
          </p>
          <p className="text-xs mt-1.5" style={{ color: 'var(--muted2)' }}>
            ↑ {fmtPKR(todayEarning)} today
          </p>
        </div>

        <div className="p-6">
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted2)' }}>Total Invested (Locked)</p>
          <p className="font-syne font-extrabold text-2xl tracking-tight">{fmtPKR(totalInvested)}</p>
          <p className="text-xs mt-1.5" style={{ color: 'var(--muted2)' }}>Active plans 🔒</p>
        </div>

        <div className="p-6">
          <p className="text-xs mb-1.5" style={{ color: 'var(--muted2)' }}>All-Time Earned</p>
          <p className="font-syne font-extrabold text-2xl tracking-tight">{fmtPKR(totalEarned)}</p>
          <p className="text-xs mt-1.5" style={{ color: 'var(--muted2)' }}>From all plans</p>
        </div>

        <div className="p-6 flex flex-col gap-2.5 justify-center">
          <Button size="sm" onClick={() => navigate('/deposit')}>💳 Deposit</Button>
          <Button size="sm" variant="secondary" onClick={() => navigate('/withdraw')}>💸 Withdraw</Button>
        </div>
      </div>
    </div>
  )
}
