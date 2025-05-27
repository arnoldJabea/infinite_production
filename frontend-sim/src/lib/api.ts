import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3333',
})

export function login(email: string, password: string) {
  return api.post('/login', { email, password })
}

export function getMe(token: string) {
  return api.get('/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
export default api;