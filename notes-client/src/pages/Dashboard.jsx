import { useState, useEffect, useMemo } from 'react'
import useNotes from '../hooks/useNotes'
import { useReminders } from '../hooks/useReminders'
import Sidebar from '../components/Sidebar'
import NotesList from '../features/notes/NotesList'
import NoteEditor from '../features/notes/NoteEditor'
import { stripHtml, needsWeakTopicRevision } from '../utils/html'

const Dashboard = () => {
  const { notes, loading, error, loadNotes } = useNotes()

  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [editorNote, setEditorNote] = useState(undefined)

  useReminders(notes)

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const revisionDue = useMemo(
    () => notes.filter((n) => needsWeakTopicRevision(n)),
    [notes]
  )

  const filtered = useMemo(() => {
    let result = notes
    if (activeTag) {
      result = result.filter((n) => n.tags?.includes(activeTag))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((n) => {
        const body = stripHtml(n.content || '').toLowerCase()
        return n.title?.toLowerCase().includes(q) || body.includes(q)
      })
    }
    return result
  }, [notes, search, activeTag])

  const requestNotifications = () => {
    if (!('Notification' in window)) return
    Notification.requestPermission().catch(() => {})
  }

  return (
    <div style={styles.layout}>
      <Sidebar
        search={search}
        onSearch={setSearch}
        onNewNote={() => setEditorNote(null)}
        activeTag={activeTag}
        onTagSelect={setActiveTag}
      />

      <main style={styles.main}>
        <div style={styles.topBar}>
          <h2 style={styles.pageTitle}>{activeTag ? `#${activeTag}` : 'All notes'}</h2>
          <span style={styles.count}>
            {filtered.length} note{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {revisionDue.length > 0 && (
          <div className="card" style={styles.revisionBanner}>
            <div style={styles.revisionTitle}>
              <span>📚</span>
              <strong>Revision due</strong>
              <span style={styles.revisionMeta}>
                {revisionDue.length} note{revisionDue.length !== 1 ? 's' : ''} with weak topics (review weekly)
              </span>
            </div>
            <ul style={styles.revisionList}>
              {revisionDue.slice(0, 6).map((n) => (
                <li key={n._id}>
                  <button type="button" style={styles.revisionLink} onClick={() => setEditorNote(n)}>
                    {n.title || 'Untitled'}
                    {n.weakTopics?.length ? (
                      <span style={styles.revisionTopics}>
                        {' '}
                        — {n.weakTopics.join(', ')}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
            {revisionDue.length > 6 && (
              <p style={styles.revisionMore}>+ {revisionDue.length - 6} more in your library</p>
            )}
          </div>
        )}

        <div style={styles.noticeRow}>
          <span style={styles.noticeText}>
            Reminders use browser notifications while this tab is open.
          </span>
          {'Notification' in window && Notification.permission !== 'granted' && (
            <button type="button" className="btn btn-ghost" style={styles.noticeBtn} onClick={requestNotifications}>
              Enable notifications
            </button>
          )}
        </div>

        {loading && (
          <div style={styles.status}>
            <span style={styles.spinner} />
            Loading your notes…
          </div>
        )}

        {error && !loading && (
          <div style={styles.errorBox}>
            {error}
            <button className="btn btn-ghost" style={{ fontSize: '13px' }} onClick={loadNotes}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && <NotesList notes={filtered} onEdit={(note) => setEditorNote(note)} />}
      </main>

      {editorNote !== undefined && (
        <NoteEditor note={editorNote} onClose={() => setEditorNote(undefined)} />
      )}
    </div>
  )
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 60px)',
  },
  main: {
    flex: 1,
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    overflowY: 'auto',
  },
  topBar: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  pageTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '24px',
    fontWeight: 600,
  },
  count: {
    fontSize: '13px',
    color: 'var(--text-3)',
  },
  revisionBanner: {
    padding: '16px 18px',
    borderColor: 'var(--accent)',
    background: 'var(--accent-glow)',
  },
  revisionTitle: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--text-1)',
    marginBottom: '10px',
  },
  revisionMeta: {
    fontSize: '12px',
    color: 'var(--text-3)',
    fontWeight: 400,
  },
  revisionList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  revisionLink: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
    fontFamily: 'var(--font-body)',
  },
  revisionTopics: {
    color: 'var(--text-3)',
    fontSize: '13px',
  },
  revisionMore: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '8px',
  },
  noticeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  noticeText: {
    fontSize: '12px',
    color: 'var(--text-3)',
  },
  noticeBtn: {
    fontSize: '12px',
    padding: '6px 12px',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--text-2)',
    fontSize: '14px',
    padding: '40px 0',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid var(--border)',
    borderTopColor: 'var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--danger)',
    fontSize: '14px',
    padding: '14px 16px',
    background: 'rgba(239,68,68,0.08)',
    borderRadius: 'var(--radius)',
    border: '1px solid rgba(239,68,68,0.2)',
  },
}

export default Dashboard
