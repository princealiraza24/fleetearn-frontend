import { useState } from 'react'
import { useAdminUsers } from '@/hooks/useAdmin'
import { adminApi } from '@/api/admin'
import { fmtPKR, fmtDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAdminUsers(page)
  const qc = useQueryClient()

  const { mutate: block } = useMutation({
    mutationFn: adminApi.blockUser,
    onSuccess: () => { toast.success('User blocked.'); qc.invalidateQueries({ queryKey: ['admin','users'] }) },
  })
  const { mutate: unblock } = useMutation({
    mutationFn: adminApi.unblockUser,
    onSuccess: () => { toast.success('User unblocked.'); qc.invalidateQueries({ queryKey: ['admin','users'] }) },
  })

  const filtered = data?.items.filter(u =>
    !search ||
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const totalPages = data ? Math.ceil(data.totalCount / 20) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-2xl tracking-tight">Users</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted2)' }}>
            {data?.totalCount ?? 0} registered accounts
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--muted2)' }} />
        <input
          className="w-full max-w-sm rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-colors"
          style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            color: 'var(--text)'
          }}
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={e  => e.target.style.borderColor = 'var(--green)'}
          onBlur={e   => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin" style={{ color: 'var(--green)' }} />
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--card2)', borderBottom: '1px solid var(--border)' }}>
                {['User', 'Phone', 'Wallet Balance', 'Referral Code', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--muted2)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id}
                  style={{
                    background: i % 2 === 0 ? 'var(--card)' : 'var(--black2)',
                    borderBottom: '1px solid var(--border)'
                  }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: 'var(--faint)', color: 'var(--green)', border: '1px solid var(--border)' }}>
                        {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2)}
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted2)' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted2)' }}>
                    {user.phoneNumber || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-syne font-bold" style={{ color: 'var(--green)' }}>
                      {fmtPKR(user.walletBalance)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs px-2 py-1 rounded-lg"
                      style={{ background: 'var(--faint)', color: 'var(--green)', border: '1px solid var(--border)' }}>
                      {user.referralCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--muted2)' }}>
                    {fmtDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Active' : 'Blocked'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <button
                        onClick={() => block(user.id)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => unblock(user.id)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: 'var(--faint)', color: 'var(--green)', border: '1px solid var(--border)' }}>
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: 'var(--muted2)' }}>
              No users found.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm"
            disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft size={14} /> Previous
          </Button>
          <span className="text-xs" style={{ color: 'var(--muted2)' }}>
            Page {page} of {totalPages}
          </span>
          <Button variant="secondary" size="sm"
            disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}
