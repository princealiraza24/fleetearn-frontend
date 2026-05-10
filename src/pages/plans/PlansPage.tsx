import { usePlans } from '@/hooks/usePlans'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { fmtPKR, PLAN_BRANDS } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import type { FleetPlan } from '@/types'

const BRANDS = ['🛍️ Daraz', '🍔 Foodpanda', '📦 TCS', '🐆 Leopard', '🚗 Bykea', '🛺 Rider.pk', '📮 Pak Post', '📱 Careem Now']
const VEHICLE_ICONS: Record<string, string> = { Bike: '🛵', Truck: '🚚' }

export default function PlansPage() {
  const { data: plans, isLoading } = usePlans()
  const navigate = useNavigate()

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin" style={{ color: 'var(--green)' }} />
    </div>
  )

  return (
    <div className="space-y-8">

      {/* Brands */}
      <div>
        <p className="text-xs mb-3" style={{ color: 'var(--muted2)' }}>
          FleetEarn operates with Pakistan's top courier networks:
        </p>
        <div className="flex flex-wrap gap-2">
          {BRANDS.map(b => (
            <span key={b} className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted2)' }}>
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans?.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} featured={i === 2}
            onInvest={() => navigate('/deposit', { state: { planId: plan.id } })} />
        ))}
      </div>

      {/* How it works */}
      <div>
        <h2 className="font-syne font-bold text-lg mb-4">How Investments Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { n:'01', icon:'💳', title:'Deposit',       desc:'Send funds via EasyPaisa, JazzCash, or USDT. Min Rs.1,000.' },
            { n:'02', icon:'🚚', title:'Fleet Activates', desc:'Your funds are allocated to active delivery fleet vehicles.' },
            { n:'03', icon:'⚡', title:'Earn Daily',     desc:'Returns credited to your wallet every day at midnight.' },
            { n:'04', icon:'🎉', title:'Double & Withdraw', desc:'Full doubled amount unlocked on maturity. Withdraw anytime after.' },
          ].map(s => (
            <div key={s.n} className="rounded-xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="font-syne text-3xl font-extrabold mb-3 opacity-10">{s.n}</p>
              <p className="text-2xl mb-3">{s.icon}</p>
              <p className="font-semibold text-sm mb-1">{s.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted2)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlanCard({ plan, featured, onInvest }: { plan: FleetPlan; featured: boolean; onInvest: () => void }) {
  const icon = VEHICLE_ICONS[plan.vehicleType] ?? '🚚'
  const brands = PLAN_BRANDS[plan.name] ?? []

  return (
    <div className="rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{
        background: featured ? 'linear-gradient(135deg,#0e160e,#111911)' : 'var(--card)',
        border: `2px solid ${featured ? 'var(--green)' : 'var(--border)'}`,
        boxShadow: featured ? '0 0 40px rgba(34,197,94,0.1)' : 'none'
      }}>

      {featured && (
        <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: 'var(--green)', color: '#000' }}>
          FASTEST
        </span>
      )}

      <span className="text-4xl mb-4 block">{icon}</span>
      <h3 className="font-syne font-bold text-base mb-1">{plan.name}</h3>
      <p className="text-xs mb-4" style={{ color: 'var(--muted2)' }}>
        {fmtPKR(plan.minAmount)} – {fmtPKR(plan.maxAmount)}
      </p>

      <p className="font-syne font-extrabold text-4xl leading-none mb-1"
        style={{ color: 'var(--green)' }}>
        {plan.dailyReturnPercent.toFixed(2)}%
      </p>
      <p className="text-xs mb-4" style={{ color: 'var(--muted2)' }}>daily return</p>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid var(--border)', color: 'var(--green)' }}>
        🔒 Doubles in {plan.durationDays} days
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {brands.map(b => (
          <span key={b} className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--faint)', color: 'var(--muted2)', border: '1px solid var(--border)' }}>
            {b}
          </span>
        ))}
      </div>

      <Button size="md" className="w-full" onClick={onInvest}>
        Invest Now
      </Button>
    </div>
  )
}
