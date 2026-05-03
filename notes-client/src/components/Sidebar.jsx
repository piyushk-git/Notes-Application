import useNotes from '../hooks/useNotes'

const Sidebar = ({ search, onSearch, onNewNote, activeTag, onTagSelect }) => {
  const { notes } = useNotes()

  // Extract unique tags from all notes
  const tags = [...new Set(notes.flatMap((n) => n.tags ?? []))]

  return (
    <aside style={styles.sidebar}>
      {/* Search */}
      <div style={styles.section}>
        <input
          className="input"
          type="text"
          placeholder="Search notes…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ fontSize: '13px' }}
        />
      </div>

      {/* New note */}
      <button className="btn btn-primary" style={styles.newBtn} onClick={onNewNote}>
        <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
        New note
      </button>

      {/* Stats */}
      <div style={styles.section}>
        <p style={styles.statsLabel}>
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Tags</h4>
          <ul style={styles.tagList}>
            <li>
              <button
                style={{
                  ...styles.tagBtn,
                  ...(activeTag === null ? styles.tagActive : {}),
                }}
                onClick={() => onTagSelect(null)}
              >
                All notes
              </button>
            </li>
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  style={{
                    ...styles.tagBtn,
                    ...(activeTag === tag ? styles.tagActive : {}),
                  }}
                  onClick={() => onTagSelect(tag)}
                >
                  # {tag}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

const styles = {
  sidebar: {
    width: '240px',
    flexShrink: 0,
    borderRight: '1px solid var(--border)',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: 'calc(100vh - 60px)',
    position: 'sticky',
    top: '60px',
    overflowY: 'auto',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  newBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '10px',
  },
  statsLabel: {
    fontSize: '12px',
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 500,
  },
  sectionTitle: {
    fontSize: '11px',
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    marginBottom: '4px',
  },
  tagList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  tagBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-2)',
    fontSize: '13px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'background 0.15s, color 0.15s',
  },
  tagActive: {
    background: 'var(--accent-glow)',
    color: 'var(--accent)',
  },
}

export default Sidebar
