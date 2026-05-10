import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, suffix, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium" style={{ color: 'var(--muted2)' }}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-4 text-sm font-syne font-semibold"
              style={{ color: 'var(--muted2)' }}>
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl py-3.5 text-sm outline-none transition-colors',
              prefix ? 'pl-12 pr-4' : 'px-4',
              suffix ? 'pr-12' : '',
              className
            )}
            style={{
              background: 'var(--black2)',
              border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--border)',
              color: 'var(--text)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--border)'}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4">{suffix}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
