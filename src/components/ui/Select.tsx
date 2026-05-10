import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium" style={{ color: 'var(--muted2)' }}>{label}</label>
      )}
      <select
        ref={ref}
        className={cn('w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-colors appearance-none', className)}
        style={{
          background: 'var(--black2)',
          border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid var(--border)',
          color: 'var(--text)',
        }}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: 'var(--black2)' }}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Select.displayName = 'Select'
