import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { transactionAPI, accountAPI, budgetAPI } from '../services/api'
import TransactionList from '../components/TransactionList'
import BudgetProgress from '../components/BudgetProgress'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [selectedChart, setSelectedChart] = useState('both') // 'line', 'bar', or 'both'

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
    // Group transactions by date
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
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
        },
      ],
    })
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} RWF`
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} RWF`
        }
      }
    }
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
              {Number(account.balance || 0).toFixed(2)} RWF
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Income vs Expenses</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedChart('line')}
              className={`px-3 py-1 rounded-md ${
                selectedChart === 'line' ? 'bg-forest-900 text-white' : 'bg-gray-100'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setSelectedChart('bar')}
              className={`px-3 py-1 rounded-md ${
                selectedChart === 'bar' ? 'bg-forest-900 text-white' : 'bg-gray-100'
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setSelectedChart('both')}
              className={`px-3 py-1 rounded-md ${
                selectedChart === 'both' ? 'bg-forest-900 text-white' : 'bg-gray-100'
              }`}
            >
              Both
            </button>
          </div>
        </div>
        
        {chartData && (
          <div className={`grid ${selectedChart === 'both' ? 'grid-cols-2 gap-4' : ''}`}>
            {(selectedChart === 'line' || selectedChart === 'both') && (
              <div className="h-[300px]">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
            {(selectedChart === 'bar' || selectedChart === 'both') && (
              <div className="h-[300px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium">Recent Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>

        <div className="rounded-lg bg-white p-6 shadow flex flex-col">
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