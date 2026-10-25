import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext.jsx'

export default function Login() {
  const { login, isAdmin } = useShop()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAdmin) return <Navigate to="/admin" replace />
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try { await login(email, password); nav('/admin') }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm space-y-4 mt-6">
      <h1 className="text-2xl font-extrabold text-center">Owner login</h1>
      {error && <p className="bg-red-50 text-red-700 rounded-xl px-4 py-2 text-sm">{error}</p>}
      <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn-pink w-full" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
    </form>
  )
}
