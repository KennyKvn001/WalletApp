import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { transactionAPI, accountAPI, budgetAPI } from '../services/api'
import TransactionList from '../components/TransactionList'
import BudgetProgress from '../components/BudgetProgress'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [chartData, setChartData] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [budgets, setBudgets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, accountsRes, budgetsRes] = await Promise.all([
          transactionAPI.getAll(),
          accountAPI.getAll(),
          budgetAPI.getAll(),
        ])
        
        processTransactionData(transactionsRes.data)
        setAccounts(accountsRes.data)
        setBudgets(budgetsRes.data)
        setTransactions(transactionsRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const processTransactionData = (transactions) => {
    // Process data for chart
    const dates = [...new Set(transactions.map(t => t.date))].sort()
    const incomeData = dates.map(date => 
      transactions
        .filter(t => t.date === date && t.type === 'IN')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    )
    const expenseData = dates.map(date => 
      transactions
        .filter(t => t.date === date && t.type === 'OUT')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    )

    setChartData({
      labels: dates,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    })
  }

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <div key={account.id} className="rounded-lg bg-white p-4 shadow">
            <h2 className="text-lg font-medium">{account.name}</h2>
            <p className="text-2xl font-bold">
              ${Number(account.balance || 0).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-medium">Income vs Expenses</h2>
        {chartData && (
          <div className="h-[300px]">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium">Recent Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium">Budget Overview</h2>
          <div className="space-y-4">
            {budgets.map((budget) => (
              <BudgetProgress key={budget.id} budget={budget} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

