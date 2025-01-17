import { useState, useEffect } from 'react'
import { accountAPI } from '../services/api'
import AccountForm from '../components/AccountForm'
import { Trash2 } from 'lucide-react'

export default function Accounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await accountAPI.getAll()
      setAccounts(response.data)
    } catch (err) {
      setError('Failed to fetch accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleAccountCreated = () => {
    fetchAccounts()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountAPI.delete(id)
        setAccounts(accounts.filter((account) => account.id !== id))
      } catch (err) {
        alert('Failed to delete the account')
      }
    }
  }

  if (loading) return <div>Loading accounts...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Accounts</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div key={account.id} className="rounded-lg bg-white p-4 shadow">
            <div className='flex justify-between w-[100%]'>
            <div className='flex flex-col gap-2'>
              <h2 className="text-lg font-medium">{account.name}</h2>
              <p className="text-2xl font-bold">
                  ${Number(account.balance || 0).toFixed(2)}
              </p>
            </div>
            <div className="cursor-pointer text-red-600 hover:text-red-500">
              <Trash2 onClick={() => handleDelete(account.id)} />
            </div>
            </div>
            
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Add New Account</h2>
        <AccountForm onSuccess={handleAccountCreated} />
      </div>
    </div>
  )
}

