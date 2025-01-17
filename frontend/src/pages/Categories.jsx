// Categories.jsx
import { useState, useEffect } from 'react'
import { categoryAPI } from '../services/api'
import CategoryForm from '../components/CategoryForm'
import CategoryList from '../components/CategoryList'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) return <div>Loading categories...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="mt-2 text-gray-600">
          Manage your expense and income categories
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr,3fr]">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Create Category</h2>
          <CategoryForm
            onSuccess={fetchCategories}
            categories={categories}
          />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Your Categories</h2>
          <CategoryList
            categories={categories}
            onCategoryDeleted={fetchCategories}
          />
        </div>
      </div>
    </div>
  )
}