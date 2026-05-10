import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { walletApi } from '@/api/wallet'
import { Card, CardTitle, CardSub } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useDashboard } from '@/hooks/useDashboard'
import { fmtPKR } from '@/lib/utils'
import toast from 'react-hot-toast'

const schema = z.object({
  amount:        z.number().min(500, 'Min Rs.500'),
  paymentMethod: z.enum(['EasyPaisa','JazzCash','USDT','BankTransfer']),
  accountNumber: z.string().min(1, 'Account number required'),
})
type Form = z.infer<typeof schema>

export default function WithdrawPage() {
  const { data: dash } = useDashboard()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'EasyPaisa' }
  })

  const { mutate: withdraw, isPending, isSuccess, data: result } = useMutation({
    mutationFn: walletApi.withdraw,
    onSuccess: () => toast.success('Withdrawal request submitted!'),
    onError: (e: any) => toast.error(e?.response?.data?.error ?? 'Withdrawal failed.'),
  })

  return (
    <div className="max-w-lg space-y-5">

      {/* Balance */}
      {dash && (
        <div className="rounded-2xl p-5 flex justify-between items-center"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs" style={{ color: 'var(--muted2)' }}>Available Balance</p>
            <p className="font-syne font-extrabold text-2xl mt-1"
              style={{ color: 'var(--green)' }}>{fmtPKR(dash.walletBalance)}</p>
          </div>
          {dash.totalInvested > 0 && (
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--muted2)' }}>Locked (active plans)</p>
              <p className="font-syne font-bold text-lg mt-1" style={{ color: '#f97316' }}>
                🔒 {fmtPKR(dash.totalInvested)}
              </p>
            </div>
          )}
        </div>
      )}

      {isSuccess && result && (
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid var(--border2)' }}>
          <p className="font-syne font-bold mb-1" style={{ color: 'var(--green)' }}>✅ Request Submitted</p>
          <p className="text-sm" style={{ color: 'var(--muted2)' }}>{result.message}</p>
        </div>
      )}

      <Card>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardSub>Min Rs.500 · Processed within 24 hours</CardSub>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit(d => withdraw(d))}>
          <Input label="Amount (PKR)" type="number" prefix="Rs."
            error={errors.amount?.message} {...register('amount', { valueAsNumber: true })} />

          <Select
            label="Withdraw To"
            error={errors.paymentMethod?.message}
            options={[
              { value:'EasyPaisa',    label:'🟣 EasyPaisa' },
              { value:'JazzCash',     label:'🔴 JazzCash' },
              { value:'USDT',         label:'🟢 USDT (TRC-20)' },
              { value:'BankTransfer', label:'🔵 Bank Transfer' },
            ]}
            {...register('paymentMethod')}
          />

          <Input label="Account / Wallet Number" placeholder="03XXXXXXXXX"
            error={errors.accountNumber?.message} {...register('accountNumber')} />

          <div className="rounded-xl p-4 text-xs leading-relaxed"
            style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <strong className="block mb-1" style={{ color: '#f97316' }}>⚠️ Note</strong>
            <span style={{ color: 'var(--muted2)' }}>
              Withdrawals are only available after your investment plan matures (doubled).
              Locked funds cannot be withdrawn early.
            </span>
          </div>

          <Button type="submit" size="lg" loading={isPending}>
            💸 Submit Withdrawal
          </Button>
        </form>
      </Card>
    </div>
  )
}
