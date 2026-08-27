import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Plus } from 'lucide-react'
import Topbar, { greetingFor } from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'

const CATEGORY_COLORS = ['#6C5CE7', '#4FC3E8', '#2ECC8F', '#FFB84F', '#FF6B6B', '#B15CE7']

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value ?? 0)
}

function SummaryCard({ label, value, badge, badgeTone }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      {badge && (
        <span className={`text-xs mt-2 inline-block ${badgeTone}`}>{badge}</span>
      )}
    </div>
  )
}

export default function Overview() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    client.get('/dashboard/summary')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Could not load your dashboard. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const greeting = greetingFor(new Date().getHours())

  return (
    <>
      <Topbar />
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{greeting}, {user?.name?.split(' ')[0]}</h1>
            <p className="text-sm text-muted mt-1">Here's your financial overview.</p>
          </div>
          <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover transition-colors rounded-lg px-4 py-2 text-sm font-medium">
            <Plus size={16} /> Add transaction
          </button>
        </div>

        {loading && <p className="text-muted text-sm">Loading...</p>}
        {error && <p className="text-expense text-sm">{error}</p>}

        {summary && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <SummaryCard label="Total income" value={formatMoney(summary.totalIncome)} />
              <SummaryCard label="Total expenses" value={formatMoney(summary.totalExpenses)} />
              <SummaryCard label="Savings" value={formatMoney(summary.savings)} />
              <SummaryCard
                label="Savings rate"
                value={summary.savingsRate != null ? `${summary.savingsRate}%` : '—'}
                badge={summary.savingsRate != null ? 'of income saved' : 'add income to see this'}
                badgeTone="text-muted"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-surface border border-border rounded-xl p-5">
                <h2 className="text-sm font-medium mb-1">Spending by category</h2>
                <p className="text-xs text-muted mb-4">Where your expenses are going</p>
                {summary.expensesByCategory.length === 0 ? (
                  <p className="text-sm text-muted py-10 text-center">
                    No expenses logged yet. Add your first transaction to see this chart.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {summary.expensesByCategory.map((c, i) => (
                      <li key={c.category} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                          />
                          {c.category}
                        </span>
                        <span className="text-muted">{formatMoney(c.total)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-surface border border-border rounded-xl p-5 flex flex-col items-center justify-center">
                <h2 className="text-sm font-medium mb-4 self-start">Breakdown</h2>
                {summary.expensesByCategory.length === 0 ? (
                  <p className="text-sm text-muted">Nothing to show yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={summary.expensesByCategory}
                        dataKey="total"
                        nameKey="category"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                      >
                        {summary.expensesByCategory.map((_, i) => (
                          <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatMoney(value)}
                        contentStyle={{ background: '#12161F', border: '1px solid #232838', borderRadius: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
