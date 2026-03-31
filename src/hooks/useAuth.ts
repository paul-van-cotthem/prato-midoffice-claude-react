import { useState } from 'react'

interface AuthState {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export function useAuth(): AuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('prato_auth') === 'true',
  )

  function login() {
    localStorage.setItem('prato_auth', 'true')
    setIsAuthenticated(true)
  }

  function logout() {
    localStorage.removeItem('prato_auth')
    setIsAuthenticated(false)
  }

  return { isAuthenticated, login, logout }
}
