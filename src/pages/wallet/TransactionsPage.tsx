import { useTransactions } from '@/hooks/useTransactions'
import { TransactionRow } from '@/components/shared/TransactionRow'
import { Card, CardTitle, CardSub } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'

export default function TransactionsPage() {
  const { data, isLoading, page, setPage } = useTransactions()

  return (
    <div className="max-w-2xl space-y-5">
      <Card>
        <CardTitle>Transaction History</CardTitle>
        <CardSub>Every deposit, earning, and withdrawal</CardSub>

        <div className="mt-5 space-y-2">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 size={28} className="animate-spin" style={{ color: 'var(--green)' }} />
            </div>
          )}
          {data?.items.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
          {data?.items.length === 0 && (
            <p className="text-center py-10 text-sm" style={{ color: 'var(--muted2)' }}>
              No transactions yet. Make your first deposit!
            </p>
          )}
        </div>

        {/* Pagination */}
        {data && data.totalCount > data.pageSize && (
          <div className="flex justify-between items-center mt-5 pt-5"
            style={{ borderTop: '1px solid var(--border)' }}>
            <Button variant="secondary" size="sm"
              disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              ← Previous
            </Button>
            <span className="text-xs" style={{ color: 'var(--muted2)' }}>
              Page {page} of {Math.ceil(data.totalCount / data.pageSize)}
            </span>
            <Button variant="secondary" size="sm"
              disabled={page * data.pageSize >= data.totalCount}
              onClick={() => setPage(p => p + 1)}>
              Next →
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
