// CategoryForm.jsx
import { useState } from 'react'
import { categoryAPI } from '../services/api'

export default function CategoryForm({ onSuccess, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
  })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await categoryAPI.create(formData)
      setFormData({ name: '', description: '', parent: '' })
      onSuccess()
    } catch (err) {
      setError('Failed to create category. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category Name
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
          Description
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
            rows={3}
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Parent Category
          <select
            value={formData.parent}
            onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
          >
            <option value="">None (Top Level Category)</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-forest-900 px-4 py-2 text-white hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-900 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Category'}
      </button>
    </form>
  )
}
