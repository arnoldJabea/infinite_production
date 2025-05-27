import { useState } from 'react'


export function useAuth() {
  const [user, setUser] = useState(null)

  async function login(email, password) {
    const res = await api.post('/login', { email, password })
    const { token } = res.data
    localStorage.setItem('token', token)
    setUser({ email }) // ou res.data.user si tu le renvoies
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return { user, login, logout }
}