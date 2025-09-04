import { Routes, Route, Navigate, Link } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-5xl mx-auto p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

function Header() {
  const { token, logout } = useAuth()
  return (
    <header className="bg-white border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="font-semibold">Task Tracker</Link>
        {token ? (
          <button onClick={logout} className="px-3 py-1.5 rounded bg-gray-800 text-white">Logout</button>
        ) : (
          <nav className="space-x-3">
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/signup" className="text-sm">Sign up</Link>
          </nav>
        )}
      </div>
    </header>
  )
}


