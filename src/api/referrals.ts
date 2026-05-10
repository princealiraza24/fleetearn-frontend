import api from '@/lib/axios'
import type { ReferralStats } from '@/types'

export const referralsApi = {
  getStats: () => api.get<ReferralStats>('/referrals').then(r => r.data),
}
