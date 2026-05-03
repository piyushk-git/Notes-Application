import NoteCard from '../../components/NoteCard'

/**
 * NotesList — renders filtered notes grid.
 * @prop {Note[]}   notes
 * @prop {Function} onEdit
 */
const NotesList = ({ notes, onEdit }) => {
  if (notes.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>✦</span>
        <p style={styles.emptyText}>No notes yet</p>
        <p style={styles.emptyHint}>Hit "New note" to get started</p>
      </div>
    )
  }

  return (
    <div style={styles.grid}>
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onEdit={onEdit} />
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
    alignContent: 'start',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  emptyIcon: {
    fontSize: '32px',
    color: 'var(--accent)',
    marginBottom: '8px',
  },
  emptyText: {
    fontFamily: 'var(--font-display)',
    fontSize: '20px',
    color: 'var(--text-2)',
  },
  emptyHint: {
    fontSize: '13px',
    color: 'var(--text-3)',
  },
}

export default NotesList
