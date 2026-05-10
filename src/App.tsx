import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import AppLayout   from '@/components/layout/AppLayout'
import AdminLayout from '@/components/layout/AdminLayout'

// Auth pages
import LoginPage    from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// App pages
import DashboardPage    from '@/pages/dashboard/DashboardPage'
import PlansPage        from '@/pages/plans/PlansPage'
import CalculatorPage   from '@/pages/plans/CalculatorPage'
import DepositPage      from '@/pages/wallet/DepositPage'
import WithdrawPage     from '@/pages/wallet/WithdrawPage'
import TransactionsPage from '@/pages/wallet/TransactionsPage'
import ReferralsPage    from '@/pages/referrals/ReferralsPage'
import ProfilePage      from '@/pages/profile/ProfilePage'

// Admin pages
import AdminOverviewPage     from '@/pages/admin/AdminOverviewPage'
import AdminDepositsPage     from '@/pages/admin/AdminDepositsPage'
import AdminWithdrawalsPage  from '@/pages/admin/AdminWithdrawalsPage'
import AdminUsersPage        from '@/pages/admin/AdminUsersPage'

export default function App() {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── User App ── */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard"    element={<DashboardPage />} />
        <Route path="/plans"        element={<PlansPage />} />
        <Route path="/calculator"   element={<CalculatorPage />} />
        <Route path="/deposit"      element={<DepositPage />} />
        <Route path="/withdraw"     element={<WithdrawPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/referrals"    element={<ReferralsPage />} />
        <Route path="/profile"      element={<ProfilePage />} />
      </Route>

      {/* ── Admin Panel ── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index                  element={<AdminOverviewPage />} />
        <Route path="deposits"        element={<AdminDepositsPage />} />
        <Route path="withdrawals"     element={<AdminWithdrawalsPage />} />
        <Route path="users"           element={<AdminUsersPage />} />
      </Route>

      {/* ── Defaults ── */}
      <Route path="/"  element={<Navigate to="/dashboard" replace />} />
      <Route path="*"  element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
