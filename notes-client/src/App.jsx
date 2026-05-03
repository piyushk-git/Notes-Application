import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotesProvider } from './context/NotesContext'
import useAuth from './hooks/useAuth'

import Navbar     from './components/Navbar'
import Home       from './pages/Home'
import Login      from './pages/Login'
import Signup     from './pages/Signup'
import Dashboard  from './pages/Dashboard'

// ── Protected route wrapper ────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <span style={{ color: 'var(--text-3)', fontFamily: 'var(--font-display)', fontSize: '18px' }}>
          ✦
        </span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// ── Public-only route (redirect if logged in) ──────
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

// ── Inner app (needs AuthContext) ──────────────────
const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={<GuestRoute><Login /></GuestRoute>}
      />
      <Route
        path="/signup"
        element={<GuestRoute><Signup /></GuestRoute>}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <NotesProvider>
              <Dashboard />
            </NotesProvider>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
)

// ── Root App ───────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
)

export default App
