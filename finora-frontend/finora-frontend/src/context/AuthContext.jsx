import { createContext, useContext, useState } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('finora_user')
    return stored ? JSON.parse(stored) : null
  })

  function persistSession(data) {
    localStorage.setItem('finora_token', data.token)
    localStorage.setItem('finora_user', JSON.stringify({
      userId: data.userId, name: data.name, email: data.email,
    }))
    setUser({ userId: data.userId, name: data.name, email: data.email })
  }

  async function login(email, password) {
    const { data } = await client.post('/auth/login', { email, password })
    persistSession(data)
  }

  async function register(name, email, password) {
    const { data } = await client.post('/auth/register', { name, email, password })
    persistSession(data)
  }

  function logout() {
    localStorage.removeItem('finora_token')
    localStorage.removeItem('finora_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
