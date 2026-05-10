import { useQuery } from '@tanstack/react-query'
import { walletApi } from '@/api/wallet'
import { useState } from 'react'

export function useTransactions() {
  const [page, setPage] = useState(1)
  const query = useQuery({
    queryKey: ['transactions', page],
    queryFn: () => walletApi.transactions(page),
    placeholderData: (prev) => prev,
  })
  return { ...query, page, setPage }
}
