import { useState, useEffect } from 'react'
import { transactionAPI, categoryAPI, accountAPI } from '../services/api'

export default function TransactionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    account: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'OUT',
  })
  const [accounts, setAccounts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          accountAPI.getAll(),
          categoryAPI.getAll(),
        ])
        setAccounts(accountsRes.data)
        setCategories(categoriesRes.data)
      } catch (error) {
        setError('Error loading form data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await transactionAPI.create(formData)
      onSuccess?.()
      setFormData({
        account: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'OUT',
      })
    } catch (error) {
      setError('Error creating transaction')
    }
  }

  if (loading) return <div>Loading form...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-500">{error}</div>
      )}
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="IN">Income</option>
              <option value="OUT">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account
            <select
              value={formData.account}
              onChange={(e) =>
                setFormData({ ...formData, account: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-forest-900 px-4 py-2 text-white hover:bg-forest-800"
        >
          Create Transaction
        </button>
      </div>
    </form>
  )
}

