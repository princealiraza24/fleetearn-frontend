import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-2xl p-6', className)}
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex items-start justify-between mb-5', className)}>{children}</div>
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-syne font-bold text-base">{children}</h3>
}

export function CardSub({ children }: { children: React.ReactNode }) {
  return <p className="text-xs mt-1" style={{ color: 'var(--muted2)' }}>{children}</p>
}
