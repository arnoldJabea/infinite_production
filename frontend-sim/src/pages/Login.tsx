import { useState } from 'react'
import { api } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { data } = await api.post('/login', { email, password })
      localStorage.setItem('token', data.token)          // <- ton contrôleur renvoie { token, user }
      window.location.href = '/projects'
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erreur')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h1 className="text-2xl font-bold">Connexion</h1>
      {error && <p className="text-red-600">{error}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      <button className="bg-blue-500 text-white px-4 py-2">Se connecter</button>
    </form>
  )
}