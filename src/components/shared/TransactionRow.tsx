import type { Transaction } from '@/types'
import { fmtPKR, fmtRelative } from '@/lib/utils'

const iconMap: Record<string, string> = {
  EarningCredit: '⚡',
  Deposit:       '💳',
  Withdrawal:    '💸',
  ReferralBonus: '🔗',
}

const colorMap: Record<string, React.CSSProperties> = {
  EarningCredit: { background: 'rgba(34,197,94,0.1)' },
  Deposit:       { background: 'rgba(59,130,246,0.1)' },
  Withdrawal:    { background: 'rgba(239,68,68,0.08)' },
  ReferralBonus: { background: 'rgba(168,85,247,0.1)' },
}

const labelMap: Record<string, string> = {
  EarningCredit: 'Daily Earning',
  Deposit:       'Deposit',
  Withdrawal:    'Withdrawal',
  ReferralBonus: 'Referral Bonus',
}

export function TransactionRow({ tx }: { tx: Transaction }) {
  const isCredit = tx.type !== 'Withdrawal'

  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl transition-colors"
      style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
        style={colorMap[tx.type]}>
        {iconMap[tx.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {labelMap[tx.type]}
          {tx.paymentMethod && (
            <span className="text-xs ml-1.5" style={{ color: 'var(--muted2)' }}>
              · {tx.paymentMethod}
            </span>
          )}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>
          {fmtRelative(tx.createdAt)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-syne font-bold text-sm"
          style={{ color: isCredit ? 'var(--green)' : '#ef4444' }}>
          {isCredit ? '+' : '-'}{fmtPKR(tx.amount)}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>{tx.status}</p>
      </div>
    </div>
  )
}
