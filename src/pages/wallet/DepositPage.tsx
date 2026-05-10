import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { walletApi } from '@/api/wallet'
import { usePlans } from '@/hooks/usePlans'
import { Card, CardTitle, CardSub } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { fmtPKR } from '@/lib/utils'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const schema = z.object({
  planId:        z.string().min(1, 'Select a plan'),
  amount:        z.number().min(1000, 'Min Rs.1,000'),
  paymentMethod: z.enum(['EasyPaisa','JazzCash','USDT','BankTransfer']),
})
type Form = z.infer<typeof schema>

const PM_ICONS: Record<string, string> = {
  EasyPaisa: '🟣', JazzCash: '🔴', USDT: '🟢', BankTransfer: '🔵'
}

export default function DepositPage() {
  const { data: plans } = usePlans()
  const location = useLocation()
  const [instructions, setInstructions] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'EasyPaisa', amount: 1000 }
  })

  useEffect(() => {
    if (location.state?.planId) setValue('planId', location.state.planId)
  }, [location.state, setValue])

  const selectedPlanId = watch('planId')
  const selectedPlan   = plans?.find(p => p.id === selectedPlanId)

  const { mutate: deposit, isPending } = useMutation({
    mutationFn: walletApi.deposit,
    onSuccess: (data) => {
      setInstructions(data.paymentInstructions)
      toast.success('Deposit initiated! Follow instructions below.')
    },
    onError: (e: any) => toast.error(e?.response?.data?.error ?? 'Deposit failed.'),
  })

  return (
    <div className="max-w-lg space-y-5">

      {/* Instructions shown after submit */}
      {instructions && (
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid var(--border2)' }}>
          <p className="font-syne font-bold mb-2" style={{ color: 'var(--green)' }}>
            ✅ Payment Instructions
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--muted2)' }}>{instructions}</p>
          <p className="text-xs mt-3" style={{ color: 'var(--muted)' }}>
            After sending payment, your deposit will be confirmed by admin within 1–2 hours.
            Your investment will activate automatically.
          </p>
        </div>
      )}

      <Card>
        <CardTitle>Deposit Funds</CardTitle>
        <CardSub>Add money to activate an investment plan</CardSub>

        <form className="mt-5 space-y-4"
          onSubmit={handleSubmit(d => deposit({ ...d, planId: d.planId }))}>

          <Select
            label="Select Fleet Plan"
            error={errors.planId?.message}
            options={[
              { value: '', label: '— Choose a plan —' },
              ...(plans?.map(p => ({
                value: p.id,
                label: `${p.name} — ${fmtPKR(p.minAmount)}–${fmtPKR(p.maxAmount)} · ${p.dailyReturnPercent.toFixed(2)}%/day`
              })) ?? [])
            ]}
            {...register('planId')}
          />

          {selectedPlan && (
            <div className="rounded-xl px-4 py-3 text-xs"
              style={{ background: 'var(--faint)', border: '1px solid var(--border)' }}>
              🔒 Doubles in <strong>{selectedPlan.durationDays} days</strong> ·
              {' '}Daily {selectedPlan.dailyReturnPercent.toFixed(2)}% ·
              {' '}Min {fmtPKR(selectedPlan.minAmount)}
            </div>
          )}

          <Input
            label="Amount (PKR)"
            type="number"
            prefix="Rs."
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--muted2)' }}>
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['EasyPaisa','JazzCash','USDT','BankTransfer'] as const).map(pm => (
                <label key={pm}
                  className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: watch('paymentMethod') === pm ? 'var(--faint)' : 'var(--black2)',
                    border: `1px solid ${watch('paymentMethod') === pm ? 'var(--green)' : 'var(--border)'}`,
                  }}>
                  <input type="radio" value={pm} className="sr-only" {...register('paymentMethod')} />
                  <span>{PM_ICONS[pm]}</span>
                  <span className="text-sm font-medium">{pm}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" size="lg" loading={isPending}>
            💳 Continue to Payment
          </Button>
        </form>
      </Card>
    </div>
  )
}
