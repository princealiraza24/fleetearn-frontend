import { useDashboard } from '@/hooks/useDashboard'
import { WalletBar } from '@/components/shared/WalletBar'
import { EarningsChart } from '@/components/shared/EarningsChart'
import { InvestmentCard } from '@/components/shared/InvestmentCard'
import { TransactionRow } from '@/components/shared/TransactionRow'
import { StatCard } from '@/components/ui/Stat'
import { Card, CardHeader, CardTitle, CardSub } from '@/components/ui/Card'
import { fmtPKR } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const { data, isLoading } = useDashboard()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--green)' }} />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-5">

      {/* Wallet Bar */}
      <WalletBar
        walletBalance={data.walletBalance}
        totalInvested={data.totalInvested}
        totalEarned={data.totalEarned}
        todayEarning={data.todayEarning}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Today's Earning"
          value={fmtPKR(data.todayEarning)} change="vs yesterday" changeUp />
        <StatCard icon="📆" label="This Month"
          value={fmtPKR(data.thisMonthEarning)} change="12.1% growth" changeUp />
        <StatCard icon="🚚" label="Active Plans"
          value={String(data.activeInvestments)} change="Locked 🔒" />
        <StatCard icon="🔗" label="Referral Earned"
          value={fmtPKR(data.referralEarnings)}
          change={`${data.totalReferrals} friends`} changeUp />
      </div>

      {/* Chart + Investments */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Earnings History</CardTitle>
              <CardSub>Daily returns from your fleet</CardSub>
            </div>
          </CardHeader>
          {data.earningsChart.length > 0
            ? <EarningsChart data={data.earningsChart} />
            : <div className="h-48 flex items-center justify-center text-sm"
                style={{ color: 'var(--muted2)' }}>
                No earnings yet — invest to start earning!
              </div>
          }
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Active Investments</CardTitle>
              <CardSub>Locked until doubled 🔒</CardSub>
            </div>
            <Link to="/plans" className="text-xs font-medium" style={{ color: 'var(--green)' }}>
              All →
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {data.investments.length > 0
              ? data.investments.map(inv => (
                  <InvestmentCard key={inv.id} investment={inv} />
                ))
              : <div className="text-center py-8 text-sm" style={{ color: 'var(--muted2)' }}>
                  <p className="text-3xl mb-3">🚚</p>
                  <p>No active investments.</p>
                  <Link to="/plans" className="text-sm mt-2 block font-medium"
                    style={{ color: 'var(--green)' }}>
                    Browse Fleet Plans →
                  </Link>
                </div>
            }
          </div>
        </Card>
      </div>

      {/* Recent Transactions + Referral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardSub>Latest wallet activity</CardSub>
            </div>
            <Link to="/transactions" className="text-xs font-medium"
              style={{ color: 'var(--green)' }}>All →</Link>
          </CardHeader>
          <div className="space-y-2">
            {/* Placeholder rows shown until real data loads */}
            <div className="text-sm text-center py-4" style={{ color: 'var(--muted2)' }}>
              Visit Transactions page for full history
            </div>
          </div>
        </Card>

        {/* Referral Mini */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Referral Program</CardTitle>
              <CardSub>Earn 5% of every friend's first deposit</CardSub>
            </div>
          </CardHeader>
          <div className="rounded-xl p-4 mb-4"
            style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--muted2)' }}>Your referral link</p>
            <div className="flex items-center rounded-xl overflow-hidden"
              style={{ background: 'var(--black)', border: '1px solid var(--border)' }}>
              <span className="flex-1 px-4 py-2.5 text-sm truncate font-syne font-semibold"
                style={{ color: 'var(--green)' }}>
                fleetearn.pk/ref/FLEET-AX92
              </span>
              <button
                onClick={() => navigator.clipboard.writeText('https://fleetearn.pk/ref/FLEET-AX92')}
                className="px-4 py-2.5 text-xs font-semibold flex-shrink-0 transition-colors"
                style={{ background: 'var(--green)', color: '#000' }}>
                Copy
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Friends', value: String(data.totalReferrals) },
              { label: 'Earned',  value: fmtPKR(data.referralEarnings), green: true },
              { label: 'Rate',    value: '5%' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
                <p className="font-syne font-extrabold text-lg"
                  style={{ color: s.green ? 'var(--green)' : 'var(--text)' }}>
                  {s.value}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted2)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
