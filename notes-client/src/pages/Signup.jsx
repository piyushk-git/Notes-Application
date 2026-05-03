import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Signup = () => {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
          <h1 style={styles.title}>Create account</h1>
          <p style={styles.subtitle}>Start capturing your ideas today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Full name
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
              required
            />
          </label>

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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
              required
            />
          </label>

          <label style={styles.label}>
            Confirm password
            <input
              className="input"
              type="password"
              name="confirm"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={onChange}
              autoComplete="new-password"
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
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
    gap: '14px',
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

export default Signup
