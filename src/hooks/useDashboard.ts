import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.get,
    refetchInterval: 60_000, // refresh every 60s
    staleTime: 30_000,
  })
}
