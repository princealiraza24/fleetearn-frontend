import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'orange' | 'red' | 'muted'

const styles: Record<BadgeVariant, React.CSSProperties> = {
  green:  { background: 'rgba(34,197,94,0.1)',  color: 'var(--green)',  border: '1px solid rgba(34,197,94,0.2)' },
  orange: { background: 'rgba(249,115,22,0.1)', color: '#f97316',      border: '1px solid rgba(249,115,22,0.2)' },
  red:    { background: 'rgba(239,68,68,0.1)',  color: '#ef4444',      border: '1px solid rgba(239,68,68,0.2)' },
  muted:  { background: 'var(--faint)',          color: 'var(--muted2)', border: '1px solid var(--border)' },
}

export function Badge({
  children, variant = 'green', className
}: { children: React.ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', className)}
      style={styles[variant]}
    >
      {children}
    </span>
  )
}
