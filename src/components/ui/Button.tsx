import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const variants = {
  primary:   'text-black font-semibold shadow-lg hover:-translate-y-px',
  secondary: 'font-medium hover:opacity-100',
  ghost:     'font-medium opacity-60 hover:opacity-100',
  danger:    'font-medium',
}

const sizes = {
  sm:  'px-4 py-2 text-sm rounded-lg',
  md:  'px-5 py-3 text-sm rounded-xl',
  lg:  'px-7 py-4 text-base rounded-xl w-full',
}

export function Button({
  variant = 'primary', size = 'md',
  loading, disabled, children, className, ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant], sizes[size], className
      )}
      style={
        variant === 'primary'
          ? { background: 'var(--green)', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }
          : variant === 'secondary'
          ? { background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }
          : variant === 'danger'
          ? { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }
          : { background: 'transparent', color: 'var(--muted2)' }
      }
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
