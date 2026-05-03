import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const from = location.state?.from?.pathname ?? '/dashboard'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.main}>
      <div className="card animate-fadeInUp" style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.logoMark}>✦</span>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to your NoteKeep account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              className="input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={styles.submitBtn}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </main>
  )
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  logoMark: {
    color: 'var(--accent)',
    fontSize: '28px',
    marginBottom: '4px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 700,
  },
  subtitle: {
    color: 'var(--text-2)',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-2)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  error: {
    color: 'var(--danger)',
    fontSize: '13px',
    padding: '10px 14px',
    background: 'rgba(239,68,68,0.1)',
    borderRadius: 'var(--radius)',
  },
  submitBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '12px',
    fontSize: '15px',
    marginTop: '4px',
  },
  switchText: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-2)',
  },
}

export default Login
