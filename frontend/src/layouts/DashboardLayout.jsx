import { useState } from 'react'
import { Wallet, Home, PieChart, Settings, LogOut, DollarSign, CreditCard, FolderTree, User } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Transactions', icon: DollarSign, href: '/transactions' },
  { name: 'Accounts', icon: CreditCard, href: '/accounts' },
  { name: 'Categories', icon: FolderTree, href: '/categories' },
  { name: 'Budgets', icon: PieChart, href: '/budgets' },
]

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { logout, user } = useAuth()

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  return (
    <div className="min-h-screen bg-sage-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-64 transform bg-forest-900 transition-transform duration-300 ease-in-out lg:translate-x-0">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" className="text-2xl font-bold text-white">
            MyWallet
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-forest-800"
            >
              <item.icon className="mr-4 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium text-white hover:bg-forest-800"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <nav className="bg-forest-800 shadow-sm h-16 px-6 flex items-center justify-between">
          <div className="text-white text-lg">
            Hi {user?.username} 👋
          </div>
          <div className="relative">
            <button
              onClick={handleUserMenuClick}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-forest-100 hover:bg-forest-200 focus:outline-none"
            >
              <User className="h-5 w-5 text-white" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="min-h-screen bg-sage-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}