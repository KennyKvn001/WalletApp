// CategoryList.jsx
import { useState } from 'react'
import { categoryAPI } from '../services/api'
import { Trash2 } from 'lucide-react'

export default function CategoryList({ categories, onCategoryDeleted }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      await categoryAPI.delete(id)
      onCategoryDeleted()
    } catch (error) {
      console.error('Error deleting category:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const renderSubcategories = (subcategories) => {
    if (!subcategories || subcategories.length === 0) return null

    return (
      <div className="ml-6 mt-2 space-y-2">
        {subcategories.map((subcategory) => (
          <div
            key={subcategory.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {subcategory.name}
                </h4>
                {subcategory.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {subcategory.description}
                  </p>
                )}
                {subcategory.total_spending > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    Total Spending: {subcategory.total_spending.toFixed(2)} RWF
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(subcategory.id)}
                disabled={deletingId === subcategory.id}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            {renderSubcategories(subcategory.subcategories)}
          </div>
        ))}
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return <div>No categories found.</div>
  }

  return (
    <div className="space-y-4">
      {categories
        .filter((category) => !category.parent)
        .map((category) => (
          <div
            key={category.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {category.description}
                  </p>
                )}
                {category.total_spending > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    Total Spending: {category.total_spending.toFixed(2)} RWF
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={deletingId === category.id}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            {renderSubcategories(category.subcategories)}
          </div>
        ))}
    </div>
  )
}
