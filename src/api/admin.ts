import api from '@/lib/axios'

export interface PlatformStats {
  totalUsers: number
  activeInvestors: number
  totalDeposited: number
  totalWithdrawn: number
  totalEarningsPaid: number
  platformBalance: number
  pendingDeposits: number
  pendingWithdrawals: number
  activeInvestments: number
}

export interface PendingDeposit {
  transactionId: string
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  amount: number
  paymentMethod: string
  createdAt: string
}

export interface PendingWithdrawal {
  transactionId: string
  userId: string
  userFullName: string
  userEmail: string
  amount: number
  paymentMethod: string
  createdAt: string
}

export interface AdminUser {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  walletBalance: number
  isActive: boolean
  createdAt: string
  referralCode: string
}

export const adminApi = {
  getStats: () =>
    api.get<PlatformStats>('/admin/stats').then(r => r.data),

  getPendingDeposits: () =>
    api.get<PendingDeposit[]>('/admin/deposits/pending').then(r => r.data),

  confirmDeposit: (id: string, gatewayReference?: string) =>
    api.post(`/admin/deposits/${id}/confirm`, { gatewayReference }).then(r => r.data),

  rejectDeposit: (id: string, reason: string) =>
    api.post(`/admin/deposits/${id}/reject`, { reason }).then(r => r.data),

  getPendingWithdrawals: () =>
    api.get<PendingWithdrawal[]>('/admin/withdrawals/pending').then(r => r.data),

  approveWithdrawal: (id: string) =>
    api.post(`/admin/withdrawals/${id}/approve`).then(r => r.data),

  rejectWithdrawal: (id: string, reason: string) =>
    api.post(`/admin/withdrawals/${id}/reject`, { reason }).then(r => r.data),

  getUsers: (page = 1, pageSize = 20) =>
    api.get<{ items: AdminUser[]; totalCount: number }>(`/admin/users?page=${page}&pageSize=${pageSize}`)
       .then(r => r.data),

  blockUser: (id: string) =>
    api.post(`/admin/users/${id}/block`).then(r => r.data),

  unblockUser: (id: string) =>
    api.post(`/admin/users/${id}/unblock`).then(r => r.data),
}
