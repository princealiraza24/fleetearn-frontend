import { useQuery } from '@tanstack/react-query'
import { plansApi } from '@/api/plans'

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: plansApi.getAll,
    staleTime: 5 * 60_000, // plans rarely change
  })
}
