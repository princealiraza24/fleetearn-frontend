import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function useLogin() {
  const setAuth = useAuthStore(s => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data)
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: () => toast.error('Invalid email or password.'),
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Account created! Please log in.')
      navigate('/login')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || 'Registration failed.'
      toast.error(msg)
    },
  })
}

export function useLogout() {
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  return () => {
    logout()
    navigate('/login')
    toast.success('Logged out.')
  }
}
