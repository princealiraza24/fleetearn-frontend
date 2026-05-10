import { useQuery } from '@tanstack/react-query'
import { referralsApi } from '@/api/referrals'
import { Card, CardTitle, CardSub } from '@/components/ui/Card'
import { fmtPKR, fmtDate } from '@/lib/utils'
import { Loader2, Copy, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReferralsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['referrals'],
    queryFn: referralsApi.getStats,
  })

  const copyLink = () => {
    navigator.clipboard.writeText(data?.referralLink ?? '')
    toast.success('Referral link copied!')
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join FleetEarn!', url: data?.referralLink })
    } else {
      copyLink()
    }
  }

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 size={28} className="animate-spin" style={{ color: 'var(--green)' }} />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Friends', value: String(data?.totalReferrals ?? 0) },
          { label: 'Total Earned',  value: fmtPKR(data?.totalEarned ?? 0), green: true },
          { label: 'Bonus Rate',    value: '5%' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="font-syne font-extrabold text-2xl"
              style={{ color: s.green ? 'var(--green)' : 'var(--text)' }}>{s.value}</p>
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted2)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Referral Link */}
      <Card>
        <CardTitle>Your Referral Link</CardTitle>
        <CardSub>Share with friends. Earn 5% of their first deposit — instantly.</CardSub>

        <div className="mt-4 flex rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}>
          <span className="flex-1 px-4 py-3 text-sm font-syne font-semibold truncate"
            style={{ background: 'var(--black2)', color: 'var(--green)' }}>
            {data?.referralLink ?? 'Loading...'}
          </span>
          <button onClick={copyLink}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors flex-shrink-0"
            style={{ background: 'var(--green)', color: '#000' }}>
            <Copy size={14} /> Copy
          </button>
        </div>

        <button onClick={shareLink}
          className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
          <Share2 size={15} /> Share via WhatsApp / SMS
        </button>

        <div className="mt-4 rounded-xl p-4 text-xs leading-relaxed"
          style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
          <strong className="block mb-1" style={{ color: 'var(--green)' }}>How it works</strong>
          <span style={{ color: 'var(--muted2)' }}>
            Share your link → friend registers → friend makes first deposit →
            you earn 5% bonus credited instantly to your wallet. No limit on referrals!
          </span>
        </div>
      </Card>

      {/* Referral list */}
      {data?.referrals && data.referrals.length > 0 && (
        <Card>
          <CardTitle>Your Referrals</CardTitle>
          <div className="mt-4 space-y-2">
            {data.referrals.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3.5 rounded-xl"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--faint)', color: 'var(--green)' }}>
                    {r.referredUserName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.referredUserName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>{fmtDate(r.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-syne font-bold text-sm" style={{ color: 'var(--green)' }}>
                    +{fmtPKR(r.bonusAmount)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: r.isPaid ? 'var(--green)' : 'var(--muted2)' }}>
                    {r.isPaid ? '✓ Paid' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
