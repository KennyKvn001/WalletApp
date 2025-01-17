import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(userData)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Create an Account
        </h2>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-500">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
              <input
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-900"
                value={userData.password2}
                onChange={(e) =>
                  setUserData({ ...userData, password2: e.target.value })
                }
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-forest-900 px-4 py-2 text-white hover:bg-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-900 focus:ring-offset-2"
          >
            Register
          </button>

          <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Sign in
            </Link>
          </p>
        </div>
        </form>
      </div>
    </div>
  )
}

