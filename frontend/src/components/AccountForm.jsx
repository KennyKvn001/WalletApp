import { useState } from 'react'
import { accountAPI } from '../services/api'

export default function AccountForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    balance: '',
  })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await accountAPI.create({
        ...formData,
        balance: parseFloat(formData.balance),
      })
      setFormData({ name: '', balance: '' })
      onSuccess()
    } catch (err) {
      setError('Failed to create account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Name
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
            required
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Initial Balance
          <input
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
            required
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-forest-900 px-4 py-2 text-white hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-900 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  )
}

