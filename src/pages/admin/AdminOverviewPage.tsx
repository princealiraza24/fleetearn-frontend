import { useAdminStats } from '@/hooks/useAdmin'
import { fmtPKR } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StatBlockProps {
  icon: string; label: string; value: string
  sub?: string; alert?: boolean; linkTo?: string
}

function StatBlock({ icon, label, value, sub, alert, linkTo }: StatBlockProps) {
  const inner = (
    <div className="rounded-2xl p-5 h-full transition-all hover:-translate-y-0.5"
      style={{
        background: alert ? 'rgba(249,115,22,0.06)' : 'var(--card)',
        border: `1px solid ${alert ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
      }}>
      <span className="text-2xl mb-3 block">{icon}</span>
      <p className="text-xs mb-1" style={{ color: 'var(--muted2)' }}>{label}</p>
      <p className="font-syne font-extrabold text-2xl tracking-tight"
        style={{ color: alert ? '#f97316' : 'var(--text)' }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-1.5" style={{ color: 'var(--muted2)' }}>{sub}</p>}
    </div>
  )
  return linkTo
    ? <Link to={linkTo} className="block">{inner}</Link>
    : <div>{inner}</div>
}

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--green)' }} />
    </div>
  )
  if (!stats) return null

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-syne font-extrabold text-2xl tracking-tight">Platform Overview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted2)' }}>
          Real-time FleetEarn statistics
        </p>
      </div>

      {/* Pending Actions — top priority */}
      {(stats.pendingDeposits + stats.pendingWithdrawals) > 0 && (
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.25)' }}>
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: '#f97316' }}>Actions Required</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>
              {stats.pendingDeposits} deposit{stats.pendingDeposits !== 1 ? 's' : ''} and{' '}
              {stats.pendingWithdrawals} withdrawal{stats.pendingWithdrawals !== 1 ? 's' : ''} waiting for review
            </p>
          </div>
          <div className="flex gap-2">
            {stats.pendingDeposits > 0 && (
              <Link to="/admin/deposits"
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'var(--green)', color: '#000' }}>
                Review Deposits
              </Link>
            )}
            {stats.pendingWithdrawals > 0 && (
              <Link to="/admin/withdrawals"
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'transparent', border: '1px solid rgba(249,115,22,0.4)', color: '#f97316' }}>
                Review Withdrawals
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Platform money stats */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--muted)' }}>Money Flow</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock icon="💰" label="Total Deposited"
            value={fmtPKR(stats.totalDeposited)} sub="All confirmed deposits" />
          <StatBlock icon="💸" label="Total Withdrawn"
            value={fmtPKR(stats.totalWithdrawn)} sub="All approved withdrawals" />
          <StatBlock icon="⚡" label="Earnings Paid"
            value={fmtPKR(stats.totalEarningsPaid)} sub="Daily earnings credited" />
          <StatBlock icon="🏦" label="Platform Balance"
            value={fmtPKR(stats.platformBalance)} sub="Total user wallets" />
        </div>
      </div>

      {/* Users + investments */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--muted)' }}>Users & Activity</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBlock icon="👥" label="Total Users"
            value={stats.totalUsers.toLocaleString()}
            sub="Registered accounts"
            linkTo="/admin/users" />
          <StatBlock icon="📈" label="Active Investors"
            value={stats.activeInvestors.toLocaleString()}
            sub="With active plans" />
          <StatBlock icon="🚚" label="Active Investments"
            value={stats.activeInvestments.toLocaleString()}
            sub="Plans running now" />
          <StatBlock icon="⏳" label="Pending Actions"
            value={String(stats.pendingDeposits + stats.pendingWithdrawals)}
            sub={`${stats.pendingDeposits} dep · ${stats.pendingWithdrawals} wit`}
            alert={(stats.pendingDeposits + stats.pendingWithdrawals) > 0}
            linkTo={stats.pendingDeposits > 0 ? '/admin/deposits' : '/admin/withdrawals'} />
        </div>
      </div>

      {/* Quick links */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--muted)' }}>Quick Actions</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { to: '/admin/deposits',    icon: '💳', label: 'Confirm Deposits',
              desc: `${stats.pendingDeposits} pending`, alert: stats.pendingDeposits > 0 },
            { to: '/admin/withdrawals', icon: '💸', label: 'Process Withdrawals',
              desc: `${stats.pendingWithdrawals} pending`, alert: stats.pendingWithdrawals > 0 },
            { to: '/admin/users',       icon: '👤', label: 'Manage Users',
              desc: `${stats.totalUsers} total users` },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: item.alert ? 'rgba(249,115,22,0.06)' : 'var(--card)',
                border: `1px solid ${item.alert ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
              }}>
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs mt-0.5"
                  style={{ color: item.alert ? '#f97316' : 'var(--muted2)' }}>
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
