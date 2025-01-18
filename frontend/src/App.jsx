import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import TransactionForm from './components/TransactionForm';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="transactions/new" element={<TransactionForm />} />
            <Route path="categories" element={<Categories />} />
            {/* Redirect any unmatched routes to the dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

