import { useState, useEffect } from 'react'
import { budgetAPI } from '../services/api'

export default function BudgetProgress({ budget }) {
  const [progress, setProgress] = useState(null)

  useEffect(() => {
    fetchProgress()
  }, [budget.id])

  const fetchProgress = async () => {
    try {
      const response = await budgetAPI.getProgress(budget.id)
      setProgress(response.data)
    } catch (err) {
      console.error('Failed to fetch budget progress:', err)
    }
  }

  if (!progress) return null

  const percentage = (progress.total_spent / budget.limit) * 100

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="text-lg font-medium">{budget.category_name}</h3>
      <p className="text-sm text-gray-500">
        {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
      </p>
      <div className="mt-4">
        <div className="relative pt-1">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <span className="inline-block rounded-full bg-forest-200 px-2 py-1 text-xs font-semibold uppercase text-forest-800">
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-forest-900">
                ${progress.total_spent.toFixed(2)} / ${budget.limit.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded bg-forest-200">
            <div
              style={{ width: `${percentage}%` }}
              className="h-2 rounded bg-forest-500"
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

