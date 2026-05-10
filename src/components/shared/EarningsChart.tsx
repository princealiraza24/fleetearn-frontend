import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import type { EarningPoint } from '@/types'
import { format } from 'date-fns'
import { fmtPKR } from '@/lib/utils'

interface Props { data: EarningPoint[] }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl text-xs"
      style={{ background: 'var(--card2)', border: '1px solid var(--border2)' }}>
      <p style={{ color: 'var(--muted2)' }}>{label}</p>
      <p className="font-syne font-bold mt-0.5" style={{ color: 'var(--green)' }}>
        {fmtPKR(payload[0].value)}
      </p>
    </div>
  )
}

export function EarningsChart({ data }: Props) {
  const formatted = data.map(d => ({
    date: format(new Date(d.date), 'dd MMM'),
    amount: d.amount,
  }))

  return (
    <ResponsiveContainer width="100%" height={190}>
      <AreaChart data={formatted} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="earningGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--muted)', fontSize: 10 }}
          axisLine={false} tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border2)' }} />
        <Area
          type="monotone" dataKey="amount"
          stroke="var(--green)" strokeWidth={2.5}
          fill="url(#earningGrad)"
          dot={false} activeDot={{ r: 5, fill: 'var(--green)', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
