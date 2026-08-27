import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Topbar from '../components/Topbar'
import client from '../api/client'

const CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Income', 'Other']

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    amount: '', type: 'EXPENSE', category: CATEGORIES[0], description: '',
    date: new Date().toISOString().slice(0, 10),
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function loadTransactions() {
    setLoading(true)
    client.get('/transactions')
      .then((res) => setTransactions(res.data))
      .catch(() => setError('Could not load transactions.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadTransactions, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter an amount greater than 0.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await client.post('/transactions', { ...form, amount: Number(form.amount) })
      setShowForm(false)
      setForm({ ...form, amount: '', description: '' })
      loadTransactions()
    } catch {
      setError('Could not save this transaction.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    await client.delete(`/transactions/${id}`)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <>
      <Topbar />
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Transactions</h1>
            <p className="text-sm text-muted mt-1">All your income and expenses in one place.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover transition-colors rounded-lg px-4 py-2 text-sm font-medium"
          >
            <Plus size={16} /> Add transaction
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-5 mb-6 grid grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-xs text-muted mb-1 block">Amount</label>
              <input
                type="number" step="0.01" required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Date</label>
              <input
                type="date" required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-accent hover:bg-accent-hover transition-colors rounded-lg py-2 text-sm font-medium disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
            {error && <p className="text-expense text-sm col-span-5">{error}</p>}
          </form>
        )}

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-muted text-sm p-6">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-muted text-sm p-6">No transactions yet. Add your first one above.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted uppercase tracking-wide border-b border-border">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="px-5 py-3 text-muted">{t.date}</td>
                    <td className="px-5 py-3">{t.category}</td>
                    <td className="px-5 py-3 text-muted">{t.description || '—'}</td>
                    <td className={`px-5 py-3 text-right font-medium ${t.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatMoney(t.amount)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(t.id)} className="text-muted hover:text-expense" aria-label="Delete">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
