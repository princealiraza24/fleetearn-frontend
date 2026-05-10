import { Card } from './Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: string
  label: string
  value: string
  change?: string
  changeUp?: boolean
  className?: string
}

export function StatCard({ icon, label, value, change, changeUp, className }: StatCardProps) {
  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full"
        style={{ background: 'var(--faint)' }} />
      <span className="text-2xl mb-3 block">{icon}</span>
      <p className="text-xs mb-1.5" style={{ color: 'var(--muted2)' }}>{label}</p>
      <p className="font-syne font-extrabold text-2xl tracking-tight mb-2">{value}</p>
      {change && (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
          style={changeUp
            ? { background: 'rgba(34,197,94,0.1)', color: 'var(--green)' }
            : { background: 'var(--faint)', color: 'var(--muted2)' }
          }>
          {changeUp ? '↑' : '—'} {change}
        </span>
      )}
    </Card>
  )
}
