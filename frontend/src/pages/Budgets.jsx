import { useState, useEffect } from 'react'
import { budgetAPI, categoryAPI } from '../services/api'
import BudgetForm from '../components/BudgetForm'
import BudgetProgress from '../components/BudgetProgress'

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBudgets()
    fetchCategories()
  }, [])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const response = await budgetAPI.getAll()
      setBudgets(response.data)
    } catch (err) {
      setError('Failed to fetch budgets')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const handleBudgetCreated = () => {
    fetchBudgets()
  }

  if (loading) return <div>Loading budgets...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Budgets</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <BudgetProgress key={budget.id} budget={budget} />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Create New Budget</h2>
        <BudgetForm onSuccess={handleBudgetCreated} categories={categories} />
      </div>
    </div>
  )
}

