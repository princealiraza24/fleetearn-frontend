import api from '@/lib/axios'
import type { FleetPlan } from '@/types'

export const plansApi = {
  getAll: () => api.get<FleetPlan[]>('/plans').then(r => r.data),
}
