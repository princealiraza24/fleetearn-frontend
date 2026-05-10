import { useState, useMemo } from 'react'
import { Card, CardTitle, CardSub } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { fmtPKR, PLAN_BRANDS } from '@/lib/utils'
import { addDays, format } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  { id:'bike-starter',  name:'Bike Starter',  icon:'🚲', pct:2.8114, days:25, min:1000,   max:9999   },
  { id:'fleet-basic',   name:'Fleet Basic',   icon:'🛵', pct:3.5265, days:20, min:10000,  max:49999  },
  { id:'truck-pro',     name:'Truck Pro',     icon:'🚐', pct:4.7294, days:15, min:50000,  max:199999 },
  { id:'fleet-elite',   name:'Fleet Elite',   icon:'🚚', pct:4.7294, days:15, min:200000, max:9999999},
]

const QUICK = [1000, 5000, 10000, 50000, 100000, 200000]
const BRANDS = ['🛍️ Daraz Logistics','🍔 Foodpanda','📦 TCS Courier','🐆 Leopard Courier','🚗 Bykea','🛺 Rider.pk','📮 Pakistan Post','📱 Careem Now']

export default function CalculatorPage() {
  const [selected, setSelected] = useState(0)
  const [amount, setAmount] = useState(1000)
  const navigate = useNavigate()

  const plan = PLANS[selected]

  const results = useMemo(() => {
    const daily  = amount * plan.pct / 100
    return {
      daily,
      week:    daily * 7,
      day15:   daily * Math.min(15, plan.days),
      total:   amount * 2,
      unlock:  format(addDays(new Date(), plan.days), 'dd MMM yyyy'),
    }
  }, [amount, plan])

  const growthBars = useMemo(() => {
    const steps = Math.min(plan.days, 10)
    const per   = plan.days / steps
    return Array.from({ length: steps }, (_, i) => {
      const earned = results.daily * (i + 1) * per
      const pct    = earned / amount
      return { height: Math.max(4, Math.round(Math.min(pct, 1) * 52)), day: Math.round((i + 1) * per) }
    })
  }, [results.daily, amount, plan])

  return (
    <div className="space-y-6">

      {/* Brands */}
      <div>
        <p className="text-xs mb-3" style={{ color: 'var(--muted2)' }}>
          Your investment funds delivery fleets operating with:
        </p>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted2)' }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">

        {/* LEFT: Plan selection */}
        <div className="space-y-5">
          <div>
            <h2 className="font-syne font-bold text-lg mb-4">Choose Your Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLANS.map((p, i) => (
                <div key={p.id} onClick={() => { setSelected(i); setAmount(p.min) }}
                  className="rounded-2xl p-5 cursor-pointer transition-all duration-200 relative overflow-hidden"
                  style={{
                    background: selected === i ? 'rgba(34,197,94,0.04)' : 'var(--card)',
                    border: `2px solid ${selected === i ? 'var(--green)' : 'var(--border)'}`,
                  }}>
                  {selected === i && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--green)', color: '#000' }}>✓</div>
                  )}
                  <span className="text-3xl mb-3 block">{p.icon}</span>
                  <p className="font-syne font-bold text-sm mb-1">{p.name}</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted2)' }}>
                    {fmtPKR(p.min)} – {p.max > 500000 ? '∞' : fmtPKR(p.max)}
                  </p>
                  <p className="font-syne font-extrabold text-3xl leading-none mb-0.5"
                    style={{ color: 'var(--green)' }}>{p.pct.toFixed(2)}%</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted2)' }}>daily return</p>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                    style={{ background: 'rgba(34,197,94,0.08)', color: 'var(--green)', border: '1px solid var(--border)' }}>
                    🔒 Doubles in {p.days} days
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(PLAN_BRANDS[p.name] ?? []).map(b => (
                      <span key={b} className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--faint)', color: 'var(--muted2)', border: '1px solid var(--border)' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <Card>
            <CardTitle>Plan Comparison</CardTitle>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Plan','Min Deposit','Daily %','Doubles In','On Rs.10K'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-medium"
                        style={{ color: 'var(--muted2)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLANS.map((p, i) => (
                    <tr key={p.id}
                      className="transition-colors cursor-pointer"
                      onClick={() => { setSelected(i); setAmount(p.min) }}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: selected === i ? 'var(--faint)' : 'transparent'
                      }}>
                      <td className="py-3 px-3 font-medium">{p.icon} {p.name}</td>
                      <td className="py-3 px-3 text-xs" style={{ color: 'var(--muted2)' }}>{fmtPKR(p.min)}</td>
                      <td className="py-3 px-3 font-syne font-bold" style={{ color: 'var(--green)' }}>{p.pct.toFixed(2)}%</td>
                      <td className="py-3 px-3">{p.days} days</td>
                      <td className="py-3 px-3 font-syne font-bold" style={{ color: 'var(--green)' }}>→ Rs.20,000</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RIGHT: Calculator */}
        <div className="rounded-2xl p-6 sticky top-24 space-y-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div>
            <CardTitle>💰 Earnings Calculator</CardTitle>
            <CardSub>Enter amount — see exact returns</CardSub>
          </div>

          <Input
            label="Investment Amount (PKR)"
            type="number"
            prefix="Rs."
            value={amount}
            min={plan.min}
            onChange={e => setAmount(Number(e.target.value))}
          />

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2">
            {QUICK.filter(q => q >= plan.min).slice(0, 6).map(q => (
              <button key={q} onClick={() => setAmount(q)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: amount === q ? 'var(--green)' : 'transparent',
                  color: amount === q ? '#000' : 'var(--muted2)',
                  border: `1px solid ${amount === q ? 'var(--green)' : 'var(--border)'}`,
                  fontWeight: amount === q ? 600 : 400,
                }}>
                {q >= 100000 ? `${q/100000} Lakh` : `${q/1000}K`}
              </button>
            ))}
          </div>

          {/* Growth bars */}
          <div>
            <p className="text-xs mb-2" style={{ color: 'var(--muted2)' }}>📈 Day-by-day growth</p>
            <div className="flex items-end gap-1 h-14">
              {growthBars.map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${b.height}px`,
                      background: 'linear-gradient(180deg, var(--green), var(--green2))',
                      opacity: 0.7
                    }} />
                  <span className="text-xs" style={{ color: 'var(--muted)', fontSize: '0.55rem' }}>
                    d{b.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="rounded-xl p-4 space-y-0"
            style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
            {[
              { label: 'Selected Plan',         value: `${plan.icon} ${plan.name}`,          green: false },
              { label: 'Daily Return',           value: fmtPKR(results.daily),                green: true  },
              { label: 'After 7 days',           value: fmtPKR(results.week),                 green: true  },
              { label: `After ${Math.min(15,plan.days)} days`, value: fmtPKR(results.day15), green: true  },
              { label: 'Doubles in',             value: `${plan.days} days 🔒`,               green: false, orange: true },
              { label: 'Unlock / Maturity Date', value: results.unlock,                        green: false },
            ].map(r => (
              <div key={r.label} className="flex justify-between items-center py-2.5"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--muted2)' }}>{r.label}</span>
                <span className="font-syne font-bold text-sm"
                  style={{ color: r.orange ? '#f97316' : r.green ? 'var(--green)' : 'var(--text)' }}>
                  {r.value}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2.5">
              <span className="text-xs" style={{ color: 'var(--muted2)' }}>You Withdraw at Maturity</span>
              <span className="font-syne font-extrabold text-xl" style={{ color: 'var(--green)' }}>
                {fmtPKR(results.total)}
              </span>
            </div>
          </div>

          {/* Lock notice */}
          <div className="flex gap-3 rounded-xl p-4 text-xs leading-relaxed"
            style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <span className="text-base flex-shrink-0 mt-0.5">🔒</span>
            <div style={{ color: 'var(--muted2)' }}>
              <strong className="block mb-0.5" style={{ color: '#f97316' }}>Deposit locked until doubled</strong>
              Your full deposit is locked for the plan duration. You receive
              double your deposit on the maturity date. No early withdrawal.
            </div>
          </div>

          <Button size="lg" onClick={() => navigate('/deposit', { state: { planId: plan.id } })}>
            🚀 Start Investing Now
          </Button>
        </div>
      </div>
    </div>
  )
}
