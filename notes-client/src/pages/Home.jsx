import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const Home = () => {
  const { user } = useAuth()

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <main style={styles.main}>
      {/* Hero */}
      <section style={styles.hero} className="animate-fadeInUp">
        <span style={styles.badge}>✦ Your thoughts, organised</span>

        <h1 style={styles.headline}>
          Notes that think
          <br />
          <em>the way you do.</em>
        </h1>

        <p style={styles.sub}>
          A minimal, distraction-free space to capture ideas, plans, and
          anything worth remembering.
        </p>

        <div style={styles.cta}>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
            Start for free
          </Link>
          <Link to="/login" className="btn btn-ghost" style={{ fontSize: '15px', padding: '12px 28px' }}>
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section style={styles.features}>
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="card animate-fadeInUp"
            style={{ ...styles.featureCard, animationDelay: `${i * 0.08}s` }}
          >
            <span style={styles.featureIcon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureText}>{f.text}</p>
          </div>
        ))}
      </section>
    </main>
  )
}

const FEATURES = [
  { icon: '⚡', title: 'Instant capture',  text: 'Create a note in under two seconds. No friction, no folders to navigate.' },
  { icon: '🏷️', title: 'Smart tagging',    text: 'Organise with tags. Filter instantly without leaving your flow.' },
  { icon: '🔒', title: 'Secure by default', text: 'JWT-protected. Your notes are yours, always.' },
  { icon: '🌙', title: 'Easy on the eyes',  text: 'Dark, warm interface designed for long sessions.' },
]

const styles = {
  main: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '72px 24px 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '64px',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '20px',
  },
  badge: {
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
    border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: '99px',
    padding: '5px 16px',
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(40px, 7vw, 68px)',
    fontWeight: 700,
    lineHeight: 1.15,
    color: 'var(--text-1)',
  },
  sub: {
    fontSize: '17px',
    color: 'var(--text-2)',
    lineHeight: 1.7,
    maxWidth: '480px',
  },
  cta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '8px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '16px',
  },
  featureCard: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  featureIcon: {
    fontSize: '24px',
  },
  featureTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-1)',
  },
  featureText: {
    fontSize: '13px',
    color: 'var(--text-2)',
    lineHeight: 1.6,
  },
}

export default Home
