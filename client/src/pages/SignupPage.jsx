import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignupPage() {
  const [name, setName] = useState('New User')
  const [email, setEmail] = useState('new@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/signup', { name, email, password })
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Sign up</h1>
      {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" type="email" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" type="password" required />
        </div>
        <button className="w-full bg-gray-900 text-white rounded px-3 py-2">Create account</button>
        <p className="text-sm">Already have an account? <Link to="/login" className="underline">Login</Link></p>
      </form>
    </div>
  )
}


