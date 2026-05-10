import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/api/admin'
import toast from 'react-hot-toast'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
    refetchInterval: 30_000,
  })
}

export function usePendingDeposits() {
  return useQuery({
    queryKey: ['admin', 'deposits', 'pending'],
    queryFn: adminApi.getPendingDeposits,
    refetchInterval: 15_000,
  })
}

export function usePendingWithdrawals() {
  return useQuery({
    queryKey: ['admin', 'withdrawals', 'pending'],
    queryFn: adminApi.getPendingWithdrawals,
    refetchInterval: 15_000,
  })
}

export function useConfirmDeposit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ref }: { id: string; ref?: string }) =>
      adminApi.confirmDeposit(id, ref),
    onSuccess: () => {
      toast.success('Deposit confirmed — investment activated!')
      qc.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (e: any) => toast.error(e?.response?.data?.error ?? 'Confirm failed'),
  })
}

export function useRejectDeposit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectDeposit(id, reason),
    onSuccess: () => {
      toast.success('Deposit rejected.')
      qc.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (e: any) => toast.error(e?.response?.data?.error ?? 'Reject failed'),
  })
}

export function useApproveWithdrawal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminApi.approveWithdrawal(id),
    onSuccess: () => {
      toast.success('Withdrawal approved — funds sent!')
      qc.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (e: any) => toast.error(e?.response?.data?.error ?? 'Approve failed'),
  })
}

export function useRejectWithdrawal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectWithdrawal(id, reason),
    onSuccess: () => {
      toast.success('Withdrawal rejected — funds returned.')
      qc.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (e: any) => toast.error(e?.response?.data?.error ?? 'Reject failed'),
  })
}

export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => adminApi.getUsers(page),
  })
}
