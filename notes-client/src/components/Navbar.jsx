import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to={user ? '/dashboard' : '/'} style={styles.logo}>
        NoteKeep
      </Link>

      <div style={styles.actions}>
        {user ? (
          <>
            <span style={styles.greeting}>
              {user.name?.split(' ')[0]}
            </span>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/signup" className="btn btn-primary">Get started</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    height: '60px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    fontWeight: 600,
    color: 'var(--text-1)',
    textDecoration: 'none',
  },
  logoIcon: {
    color: 'var(--accent)',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  greeting: {
    color: 'var(--text-2)',
    fontSize: '14px',
    marginRight: '4px',
  },
}

export default Navbar
