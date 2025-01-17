import { useState } from 'react'
import { budgetAPI } from '../services/api'

export default function BudgetForm({ onSuccess, categories }) {
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    start_date: '',
    end_date: '',
  })
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await budgetAPI.create(formData)
      setFormData({ category: '', limit: '', start_date: '', end_date: '' })
      onSuccess()
    } catch (err) {
      setError('Failed to create budget')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
            required
          >
            <option value="">Select a category</option>
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
          Budget Limit
          <input
            type="number"
            step="0.01"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
            required
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
            required
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
            required
          />
        </label>
      </div>
      <button
        type="submit"
        className="rounded-md bg-forest-900 px-4 py-2 text-white hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-900 focus:ring-offset-2"
      >
        Create Budget
      </button>
    </form>
  )
}

