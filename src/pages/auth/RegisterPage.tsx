import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useSearchParams } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useRegister } from '@/hooks/useAuth'
import { useEffect } from 'react'

const schema = z.object({
  fullName:    z.string().min(2, 'Full name required'),
  email:       z.string().email('Invalid email'),
  phoneNumber: z.string().regex(/^(\+92|0)?3[0-9]{9}$/, 'Enter valid Pakistani number (03XXXXXXXXX)'),
  password:    z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Need uppercase').regex(/[0-9]/, 'Need digit'),
  referralCode: z.string().optional(),
})
type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const { mutate: register_, isPending } = useRegister()
  const [searchParams] = useSearchParams()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) setValue('referralCode', ref)
  }, [searchParams, setValue])

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--black)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(34,197,94,0.08), transparent)' }} />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-syne font-extrabold text-3xl tracking-tight">
            Fleet<span style={{ color: 'var(--green)' }}>Earn</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted2)' }}>
            Create your investor account
          </p>
        </div>

        <div className="rounded-2xl p-7"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit(d => register_(d))} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="Ahmed Khan"
              error={errors.fullName?.message} {...register('fullName')} />
            <Input label="Email" type="email" placeholder="ahmed@example.com"
              error={errors.email?.message} {...register('email')} />
            <Input label="Phone Number" placeholder="03001234567"
              error={errors.phoneNumber?.message} {...register('phoneNumber')} />
            <Input label="Password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 number"
              error={errors.password?.message} {...register('password')} />
            <Input label="Referral Code (optional)" placeholder="FLEET-XXXX"
              error={errors.referralCode?.message} {...register('referralCode')} />

            <Button type="submit" size="lg" loading={isPending} className="mt-2">
              Create Account — Free
            </Button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--muted2)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--green)' }} className="font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--muted)' }}>
          By registering you agree to FleetEarn's Terms of Service
        </p>
      </div>
    </div>
  )
}
