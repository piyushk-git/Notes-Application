import { createContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser } from '../features/auth/authAPI'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Hydrate user from token on first load
  useEffect(() => {
    if (token) {
      try {
        // Decode JWT payload (no verification — server handles that)
        const payload = JSON.parse(atob(token.split('.')[1]))
        // Expire check
        if (payload.exp * 1000 < Date.now()) {
          logout()
        } else {
          setUser({ id: payload.id, name: payload.name, email: payload.email })
        }
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [token])

  const saveToken = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials)
    saveToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (info) => {
    const data = await registerUser(info)
    saveToken(data.token)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
