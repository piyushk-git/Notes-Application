import { useState } from 'react'
import useNotes from '../hooks/useNotes'
import { stripHtml } from '../utils/html'

const COLORS = ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#F97316']

const NoteCard = ({ note, onEdit }) => {
  const { removeNote, editNote } = useNotes()
  const [deleting, setDeleting] = useState(false)
  const [pinning, setPinning] = useState(false)
  const [hovered, setHovered] = useState(false)

  const color = COLORS[note._id?.charCodeAt(0) % COLORS.length] ?? COLORS[0]
  const preview = stripHtml(note.content || '').slice(0, 110)
  const plain = stripHtml(note.content || '')

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this note?')) return
    setDeleting(true)
    try {
      await removeNote(note._id)
    } catch {
      setDeleting(false)
    }
  }

  const handlePin = async (e) => {
    e.stopPropagation()
    setPinning(true)
    try {
      await editNote(note._id, { isPinned: !note.isPinned })
    } catch {
      /* ignore */
    } finally {
      setPinning(false)
    }
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const reminderLabel = note.reminderAt
    ? new Date(note.reminderAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null

  return (
    <article
      className="card animate-fadeInUp"
      style={{
        ...styles.card,
        borderTopColor: color,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${color}22` : 'var(--shadow-card)',
        opacity: deleting ? 0.5 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onEdit(note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onEdit(note)}
    >
      <div style={styles.topRow}>
        <div style={styles.badges}>
          {note.isPinned && (
            <span style={styles.badgePin} title="Pinned">
              📌
            </span>
          )}
          {reminderLabel && (
            <span style={styles.badgeReminder} title="Reminder">
              🔔 {reminderLabel}
            </span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          style={styles.pinBtn}
          onClick={handlePin}
          disabled={pinning}
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          {note.isPinned ? 'Unpin' : 'Pin'}
        </button>
      </div>

      <div style={styles.body}>
        <h3 style={styles.title}>{note.title || 'Untitled'}</h3>
        <p style={styles.preview}>
          {plain ? preview + (plain.length > 110 ? '…' : '') : 'No content'}
        </p>
      </div>

      <footer style={styles.footer}>
        <time style={styles.date}>{formatDate(note.updatedAt || note.createdAt)}</time>
        <button
          className="btn btn-danger"
          style={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting}
          title="Delete note"
        >
          {deleting ? '…' : '✕'}
        </button>
      </footer>
    </article>
  )
}

const styles = {
  card: {
    borderTop: '3px solid var(--accent)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minHeight: '160px',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
    minHeight: '28px',
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    flex: 1,
  },
  badgePin: {
    fontSize: '12px',
    lineHeight: 1,
  },
  badgeReminder: {
    fontSize: '11px',
    color: 'var(--text-3)',
    background: 'var(--surface)',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
  },
  pinBtn: {
    padding: '4px 10px',
    fontSize: '12px',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--text-1)',
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  preview: {
    fontSize: '13px',
    color: 'var(--text-2)',
    lineHeight: 1.6,
    flex: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8px',
    borderTop: '1px solid var(--border)',
  },
  date: {
    fontSize: '12px',
    color: 'var(--text-3)',
  },
  deleteBtn: {
    padding: '4px 10px',
    fontSize: '12px',
    borderRadius: '6px',
  },
}

export default NoteCard
