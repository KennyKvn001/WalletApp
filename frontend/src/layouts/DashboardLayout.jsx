import { useState } from 'react'
import { Wallet, Home, PieChart, Settings, LogOut, DollarSign, CreditCard, FolderTree, User, Menu, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-sage-100">
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-forest-900 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo and close button container */}
        <div className="flex h-16 items-center justify-between px-6">
          <Link to="/" className="text-2xl font-bold text-white">
            MyWallet
          </Link>
          <button
            className="lg:hidden text-white hover:text-gray-200"
            onClick={closeMobileMenu}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-forest-800 ${
                  isActive ? 'bg-forest-800' : ''
                }`}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            )
          })}
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
        <nav className="bg-forest-800 shadow-sm h-16 px-6 flex items-center justify-between w-full fixed z-50">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-forest-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-white text-lg ml-3">
              Hi {user?.username} 👋 
            </div>
          </div>
          
          <div className="relative lg:right-[300px]">
            <button
              onClick={handleUserMenuClick}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-400 hover:bg-forest-200 focus:outline-none"
            >
              <User className="h-5 w-5 text-white" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                onClick={() => setIsUserMenuOpen(false)}
              >
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
        <main className="min-h-screen bg-sage-100 px-6 py-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}