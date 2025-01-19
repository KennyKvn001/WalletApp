import { useState } from 'react'
import { transactionAPI } from '../services/api'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

export default function TransactionList({ transactions, onTransactionDeleted }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      await transactionAPI.delete(id)
      onTransactionDeleted()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    } finally {
      setDeletingId(null)
    }
  }

  if (!transactions || transactions.length === 0) {
    return <div>No transactions found.</div>
  }

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="whitespace-nowrap px-6 py-4">
                {format(new Date(transaction.date), 'MMM d, yyyy')}
              </td>
              <td className="px-6 py-4">{transaction.description}</td>
              <td className="px-6 py-4">{transaction.category_name}</td>
              <td
                className={`whitespace-nowrap px-6 py-4 ${
                  transaction.type === 'IN'
                    ? 'text-green-600'
                    : transaction.type === 'OUT'
                    ? 'text-red-600'
                    : ''
                }`}
              >
                {transaction.type === 'IN' ? '+' : '-'}{Math.abs(
                  transaction.amount
                ).toFixed(2)} RWF
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deletingId === transaction.id}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

