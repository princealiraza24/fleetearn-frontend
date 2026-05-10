import type { UserInvestment } from '@/types'
import { fmtPKR, fmtDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface Props { investment: UserInvestment }

export function InvestmentCard({ investment: inv }: Props) {
  const progress = Math.round((inv.dayNumber / inv.totalDays) * 100)

  return (
    <div className="rounded-xl p-4 transition-colors"
      style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
            {inv.vehicleIcon}
          </div>
          <div>
            <p className="text-sm font-semibold">{inv.planName}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>
              {fmtPKR(inv.amountInvested)} · {inv.dailyPercent.toFixed(2)}%/day
            </p>
          </div>
        </div>
        <Badge variant="green">Active</Badge>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full mb-2" style={{ background: 'var(--card)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--green2), var(--green))'
          }}
        />
      </div>

      <div className="flex justify-between text-xs" style={{ color: 'var(--muted2)' }}>
        <span>Day {inv.dayNumber} of {inv.totalDays} 🔒</span>
        <span style={{ color: 'var(--green)' }}>
          Earned {fmtPKR(inv.totalEarned)}
        </span>
      </div>

      <div className="mt-3 pt-3 flex justify-between text-xs"
        style={{ borderTop: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--muted2)' }}>Matures {fmtDate(inv.maturityDate)}</span>
        <span className="font-semibold" style={{ color: 'var(--green)' }}>
          Payout {fmtPKR(inv.expectedPayout)}
        </span>
      </div>
    </div>
  )
}
