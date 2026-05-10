import { useState } from 'react'
import {
  usePendingWithdrawals, useApproveWithdrawal, useRejectWithdrawal
} from '@/hooks/useAdmin'
import { fmtPKR, fmtDateTime } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import type { PendingWithdrawal } from '@/api/admin'

const PM_COLORS: Record<string, string> = {
  EasyPaisa: '#7b2ff7', JazzCash: '#cc0000',
  USDT: '#26a17b', BankTransfer: '#2563eb'
}

function RejectModal({
  withdrawal, onClose
}: { withdrawal: PendingWithdrawal; onClose: () => void }) {
  const [reason, setReason] = useState('')
  const { mutate: reject, isPending } = useRejectWithdrawal()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--card2)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <h2 className="font-syne font-bold text-lg" style={{ color: '#ef4444' }}>
          Reject Withdrawal
        </h2>
        <div className="rounded-xl p-4 text-sm space-y-2"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between">
            <span style={{ color: 'var(--muted2)' }}>User</span>
            <span className="font-medium">{withdrawal.userFullName}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--muted2)' }}>Amount</span>
            <span className="font-syne font-bold" style={{ color: '#ef4444' }}>
              {fmtPKR(withdrawal.amount)}
            </span>
          </div>
        </div>
        <p className="text-xs rounded-xl px-3 py-2"
          style={{ background: 'rgba(34,197,94,0.07)', color: 'var(--muted2)', border: '1px solid var(--border)' }}>
          💡 The held amount will be automatically returned to the user's wallet.
        </p>
        <Input label="Rejection reason *" placeholder="e.g. Account number incorrect"
          value={reason} onChange={e => setReason(e.target.value)} />
        <div className="flex gap-3 pt-1">
          <Button variant="secondary" size="md" className="flex-1"
            onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button variant="danger" size="md" className="flex-1"
            loading={isPending} disabled={!reason.trim()}
            onClick={() => reject(
              { id: withdrawal.transactionId, reason },
              { onSuccess: onClose }
            )}>
            <XCircle size={15} /> Reject & Refund
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminWithdrawalsPage() {
  const { data: withdrawals, isLoading } = usePendingWithdrawals()
  const { mutate: approve, isPending: approving, variables: approvingId } = useApproveWithdrawal()
  const [rejecting, setRejecting] = useState<PendingWithdrawal | null>(null)

  return (
    <div className="space-y-6">
      {rejecting && <RejectModal withdrawal={rejecting} onClose={() => setRejecting(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-2xl tracking-tight">Pending Withdrawals</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted2)' }}>
            Send funds to user's account then approve here
          </p>
        </div>
        {withdrawals && withdrawals.length > 0 && (
          <Badge variant="orange">{withdrawals.length} pending</Badge>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--green)' }} />
        </div>
      )}

      {withdrawals?.length === 0 && (
        <Card>
          <div className="text-center py-12 text-sm" style={{ color: 'var(--muted2)' }}>
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold">All caught up!</p>
            <p className="mt-1">No pending withdrawals.</p>
          </div>
        </Card>
      )}

      {/* Total to pay */}
      {withdrawals && withdrawals.length > 0 && (
        <div className="rounded-2xl px-5 py-4 flex items-center justify-between"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs" style={{ color: 'var(--muted2)' }}>Total to disburse</p>
            <p className="font-syne font-extrabold text-xl mt-0.5"
              style={{ color: 'var(--green)' }}>
              {fmtPKR(withdrawals.reduce((s, w) => s + w.amount, 0))}
            </p>
          </div>
          <p className="text-sm" style={{ color: 'var(--muted2)' }}>
            {withdrawals.length} request{withdrawals.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {withdrawals?.map(wit => {
          const isApproving = approving && approvingId === wit.transactionId
          return (
            <div key={wit.transactionId}
              className="rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold text-sm"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {wit.userFullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{wit.userFullName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>{wit.userEmail}</p>
                  </div>
                </div>
                <p className="font-syne font-extrabold text-xl" style={{ color: '#ef4444' }}>
                  {fmtPKR(wit.amount)}
                </p>
              </div>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
                  <span className="w-2 h-2 rounded-full"
                    style={{ background: PM_COLORS[wit.paymentMethod] ?? '#888' }} />
                  Send via {wit.paymentMethod}
                </span>
                <span className="text-xs" style={{ color: 'var(--muted2)' }}>
                  🕒 {fmtDateTime(wit.createdAt)}
                </span>
              </div>

              <div className="rounded-xl px-4 py-3 mb-4 text-xs"
                style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', color: '#f97316' }}>
                📤 First send <strong>{fmtPKR(wit.amount)}</strong> to user's {wit.paymentMethod} account,
                then click Approve to mark as sent.
              </div>

              <div className="flex gap-3">
                <Button size="md" className="flex-1"
                  loading={isApproving}
                  onClick={() => approve(wit.transactionId)}>
                  <CheckCircle2 size={15} /> Mark as Sent
                </Button>
                <Button variant="danger" size="md"
                  onClick={() => setRejecting(wit)}>
                  <XCircle size={15} /> Reject & Refund
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
