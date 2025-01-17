import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { transactionAPI } from '../services/api'
import TransactionList from '../components/TransactionList'
import { Plus } from 'lucide-react'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await transactionAPI.getAll()
      setTransactions(response.data)
    } catch (err) {
      setError('Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center">Loading transactions...</div>
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Link
          to="/transactions/new"
          className="bg-forest-900 text-white px-4 py-2 rounded-md hover:bg-forest-800 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </Link>
      </div>
      <TransactionList transactions={transactions} onTransactionDeleted={fetchTransactions} />
    </div>
  )
}

