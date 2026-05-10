import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useLogin } from '@/hooks/useAuth'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema)
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--black)' }}>

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(34,197,94,0.08), transparent)'
        }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-syne font-extrabold text-3xl tracking-tight">
            Fleet<span style={{ color: 'var(--green)' }}>Earn</span>
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted2)' }}>
            Sign in to your account
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-7"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit(data => login(data))} className="flex flex-col gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="ahmed@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" size="lg" loading={isPending} className="mt-2">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--muted2)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--green)' }} className="font-medium">
              Create one
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-4 mt-6 text-xs" style={{ color: 'var(--muted)' }}>
          <span>🔒 SSL Secured</span>
          <span>💳 EasyPaisa</span>
          <span>💚 JazzCash</span>
        </div>
      </div>
    </div>
  )
}
