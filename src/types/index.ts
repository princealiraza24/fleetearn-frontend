// ── Auth ──
export interface LoginRequest  { email: string; password: string }
export interface RegisterRequest {
  fullName: string; email: string; password: string
  phoneNumber: string; referralCode?: string
}
export interface AuthResponse {
  userId: string; fullName: string; email: string
  accessToken: string; refreshToken: string; expiresAt: string
}

// ── Plans ──
export type VehicleType = 'Bike' | 'Truck'
export interface FleetPlan {
  id: string; name: string
  minAmount: number; maxAmount: number
  dailyReturnPercent: number; durationDays: number
  vehicleType: VehicleType; isActive: boolean; displayOrder: number
}

// ── Investments ──
export type InvestmentStatus = 'Active' | 'Matured' | 'Withdrawn'
export interface UserInvestment {
  id: string; planId: string; planName: string
  vehicleIcon: string; amountInvested: number
  dailyPercent: number; dayNumber: number; totalDays: number
  totalEarned: number; maturityDate: string; expectedPayout: number
  status: InvestmentStatus
}

// ── Transactions ──
export type TransactionType   = 'Deposit' | 'Withdrawal' | 'EarningCredit' | 'ReferralBonus'
export type TransactionStatus = 'Pending' | 'Confirmed' | 'Failed' | 'Rejected'
export type PaymentMethod     = 'EasyPaisa' | 'JazzCash' | 'USDT' | 'BankTransfer'

export interface Transaction {
  id: string; type: TransactionType; amount: number
  status: TransactionStatus; paymentMethod?: PaymentMethod
  createdAt: string; notes?: string
}

export interface PagedResult<T> {
  items: T[]; totalCount: number; page: number; pageSize: number
}

// ── Dashboard ──
export interface EarningPoint { date: string; amount: number }
export interface DashboardData {
  walletBalance: number; totalInvested: number; totalEarned: number
  todayEarning: number; thisMonthEarning: number; referralEarnings: number
  activeInvestments: number; totalReferrals: number
  investments: UserInvestment[]; earningsChart: EarningPoint[]
}

// ── Deposit ──
export interface CreateDepositRequest  { amount: number; paymentMethod: PaymentMethod; planId: string }
export interface CreateDepositResponse {
  transactionId: string; amount: number
  paymentInstructions: string; status: TransactionStatus
}

// ── Withdrawal ──
export interface WithdrawalRequest  { amount: number; paymentMethod: PaymentMethod; accountNumber: string }
export interface WithdrawalResponse { transactionId: string; message: string }

// ── Referrals ──
export interface ReferralStats {
  referralCode: string; referralLink: string
  totalReferrals: number; totalEarned: number; referrals: ReferralItem[]
}
export interface ReferralItem {
  id: string; referredUserName: string
  bonusAmount: number; isPaid: boolean; createdAt: string
}
