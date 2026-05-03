import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/**
 * useAuth — consume AuthContext with a guard.
 * Throws if used outside <AuthProvider>.
 */
const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export default useAuth
