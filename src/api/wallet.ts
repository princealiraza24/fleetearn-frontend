import api from '@/lib/axios'
import type {
  CreateDepositRequest, CreateDepositResponse,
  WithdrawalRequest, WithdrawalResponse,
  Transaction, PagedResult
} from '@/types'

export const walletApi = {
  deposit: (data: CreateDepositRequest) =>
    api.post<CreateDepositResponse>('/wallet/deposit', data).then(r => r.data),

  withdraw: (data: WithdrawalRequest) =>
    api.post<WithdrawalResponse>('/wallet/withdraw', data).then(r => r.data),

  transactions: (page = 1, pageSize = 20) =>
    api.get<PagedResult<Transaction>>(`/wallet/transactions?page=${page}&pageSize=${pageSize}`)
       .then(r => r.data),
}
