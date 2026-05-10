import { useState } from 'react'
import {
  usePendingDeposits, useConfirmDeposit, useRejectDeposit
} from '@/hooks/useAdmin'
import { fmtPKR, fmtDateTime } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import type { PendingDeposit } from '@/api/admin'

const PM_COLORS: Record<string, string> = {
  EasyPaisa: '#7b2ff7', JazzCash: '#cc0000',
  USDT: '#26a17b', BankTransfer: '#2563eb'
}

function ConfirmModal({
  deposit, onClose
}: { deposit: PendingDeposit; onClose: () => void }) {
  const [ref, setRef] = useState('')
  const { mutate: confirm, isPending } = useConfirmDeposit()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--card2)', border: '1px solid var(--border2)' }}>
        <h2 className="font-syne font-bold text-lg">Confirm Deposit</h2>

        <div className="rounded-xl p-4 space-y-2 text-sm"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
          <Row label="User"   value={deposit.userFullName} />
          <Row label="Email"  value={deposit.userEmail} />
          <Row label="Phone"  value={deposit.userPhone} />
          <Row label="Amount" value={fmtPKR(deposit.amount)} green />
          <Row label="Method" value={deposit.paymentMethod} />
          <Row label="Time"   value={fmtDateTime(deposit.createdAt)} />
        </div>

        <Input
          label="Gateway / Payment Reference (optional)"
          placeholder="e.g. TRX123456789"
          value={ref}
          onChange={e => setRef(e.target.value)}
        />

        <div className="flex gap-3 pt-1">
          <Button
            variant="secondary" size="md" className="flex-1"
            onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            size="md" className="flex-1"
            loading={isPending}
            onClick={() => confirm(
              { id: deposit.transactionId, ref: ref || undefined },
              { onSuccess: onClose }
            )}>
            <CheckCircle2 size={15} /> Confirm Deposit
          </Button>
        </div>
      </div>
    </div>
  )
}

function RejectModal({
  deposit, onClose
}: { deposit: PendingDeposit; onClose: () => void }) {
  const [reason, setReason] = useState('')
  const { mutate: reject, isPending } = useRejectDeposit()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 space-y-4"
        style={{ background: 'var(--card2)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <h2 className="font-syne font-bold text-lg" style={{ color: '#ef4444' }}>
          Reject Deposit
        </h2>

        <div className="rounded-xl p-4 text-sm"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
          <Row label="User"   value={deposit.userFullName} />
          <Row label="Amount" value={fmtPKR(deposit.amount)} green />
        </div>

        <Input
          label="Rejection reason *"
          placeholder="e.g. Payment not received, wrong account used"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />

        <div className="flex gap-3 pt-1">
          <Button variant="secondary" size="md" className="flex-1"
            onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="danger" size="md" className="flex-1"
            loading={isPending}
            disabled={!reason.trim()}
            onClick={() => reject(
              { id: deposit.transactionId, reason },
              { onSuccess: onClose }
            )}>
            <XCircle size={15} /> Reject
          </Button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: 'var(--muted2)' }}>{label}</span>
      <span className="font-medium" style={{ color: green ? 'var(--green)' : 'var(--text)' }}>
        {value}
      </span>
    </div>
  )
}

export default function AdminDepositsPage() {
  const { data: deposits, isLoading } = usePendingDeposits()
  const [confirming, setConfirming] = useState<PendingDeposit | null>(null)
  const [rejecting,  setRejecting]  = useState<PendingDeposit | null>(null)

  return (
    <div className="space-y-6">
      {confirming && <ConfirmModal deposit={confirming} onClose={() => setConfirming(null)} />}
      {rejecting  && <RejectModal  deposit={rejecting}  onClose={() => setRejecting(null)}  />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-2xl tracking-tight">Pending Deposits</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted2)' }}>
            Confirm after verifying payment in your bank / wallet app
          </p>
        </div>
        {deposits && deposits.length > 0 && (
          <Badge variant="orange">{deposits.length} pending</Badge>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--green)' }} />
        </div>
      )}

      {deposits?.length === 0 && (
        <Card>
          <div className="text-center py-12 text-sm" style={{ color: 'var(--muted2)' }}>
            <p className="text-4xl mb-3">✅</p>
            <p className="font-semibold">All caught up!</p>
            <p className="mt-1">No pending deposits to review.</p>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {deposits?.map(dep => (
          <div key={dep.transactionId}
            className="rounded-2xl p-5 transition-all"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold text-sm"
                  style={{ background: 'var(--faint)', color: 'var(--green)', border: '1px solid var(--border)' }}>
                  {dep.userFullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{dep.userFullName}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>
                    {dep.userEmail} · {dep.userPhone}
                  </p>
                </div>
              </div>
              <p className="font-syne font-extrabold text-xl" style={{ color: 'var(--green)' }}>
                {fmtPKR(dep.amount)}
              </p>
            </div>

            {/* Detail row */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}>
                <span className="w-2 h-2 rounded-full"
                  style={{ background: PM_COLORS[dep.paymentMethod] ?? '#888' }} />
                {dep.paymentMethod}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted2)' }}>
                🕒 {fmtDateTime(dep.createdAt)}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-lg"
                style={{ background: 'var(--black2)', color: 'var(--muted2)' }}>
                ID: {dep.transactionId.slice(0, 8)}...
              </span>
            </div>

            {/* Instructions reminder */}
            <div className="rounded-xl px-4 py-3 mb-4 text-xs"
              style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)', color: '#f97316' }}>
              ⚠️ Verify payment in your {dep.paymentMethod} account before confirming.
              Amount: <strong>{fmtPKR(dep.amount)}</strong>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button size="md" className="flex-1" onClick={() => setConfirming(dep)}>
                <CheckCircle2 size={15} /> Confirm Payment
              </Button>
              <Button variant="danger" size="md" onClick={() => setRejecting(dep)}>
                <XCircle size={15} /> Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
