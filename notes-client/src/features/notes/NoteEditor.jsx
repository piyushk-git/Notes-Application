import { useState, useEffect, useRef, useCallback } from 'react'
import useNotes from '../../hooks/useNotes'
import RichTextEditor from './RichTextEditor'
import { useSpeechToText } from '../../hooks/useSpeechToText'

const emptyHtml = '<p></p>'

const NoteEditor = ({ note, onClose }) => {
  const { addNote, editNote } = useNotes()
  const isEdit = Boolean(note)

  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content || emptyHtml)
  const [tags, setTags] = useState(note?.tags?.join(', ') ?? '')
  const [isPinned, setIsPinned] = useState(Boolean(note?.isPinned))
  const [reminderAt, setReminderAt] = useState(() => toDatetimeLocal(note?.reminderAt))
  const [weakTopics, setWeakTopics] = useState(note?.weakTopics?.join(', ') ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const editorRef = useRef(null)
  const titleRef = useRef(null)
  const speech = useSpeechToText()

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleMarkReviewed = async () => {
    if (!isEdit || !note?._id) return
    setSaving(true)
    setError('')
    try {
      await editNote(note._id, { lastReviewedAt: new Date().toISOString() })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update review time')
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: title.trim(),
        content: content || emptyHtml,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        isPinned,
        reminderAt: reminderAt ? new Date(reminderAt).toISOString() : null,
        weakTopics: weakTopics.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 10),
      }
      if (isEdit) {
        await editNote(note._id, payload)
      } else {
        await addNote(payload)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setSaving(false)
    }
  }

  const appendSpokenText = useCallback((text) => {
    editorRef.current?.appendText(text)
  }, [])

  const toggleVoice = () => {
    if (speech.listening) {
      speech.stop()
      return
    }
    speech.setError('')
    speech.start(appendSpokenText)
  }

  const editorKey = isEdit ? note._id : 'new'

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card animate-fadeInUp" style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.heading}>{isEdit ? 'Edit note' : 'New note'}</h2>
          <button className="btn btn-ghost" style={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.row}>
            <span style={styles.label}>Pin to top</span>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
          </label>

          <input
            ref={titleRef}
            className="input"
            placeholder="Note title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.titleInput}
          />

          <RichTextEditor
            key={editorKey}
            ref={editorRef}
            initialHtml={content}
            minHeight={240}
            onChange={setContent}
          />

          <div style={styles.voiceRow}>
            <span style={styles.label}>Dictation</span>
            <button
              type="button"
              className="btn btn-ghost"
              style={{
                ...styles.voiceBtn,
                ...(speech.listening ? styles.voiceBtnActive : {}),
              }}
              onClick={toggleVoice}
              disabled={!speech.supported || saving}
              title={
                speech.supported
                  ? speech.listening
                    ? 'Stop dictation'
                    : 'Speak and text is inserted into the note'
                  : 'Dictation needs Chrome or Edge'
              }
            >
              {speech.listening ? 'Stop dictation' : 'Start dictation'}
            </button>
          </div>
          {(speech.error || !speech.supported) && (
            <p style={styles.hint}>
              {!speech.supported
                ? 'Use Chrome or Edge on desktop for dictation (secure page: HTTPS or localhost).'
                : speech.error}
            </p>
          )}

          <input
            className="input"
            placeholder="Tags (comma separated): work, ideas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ fontSize: '13px' }}
          />

          <label style={styles.field}>
            <span style={styles.label}>Weak topics (comma separated)</span>
            <input
              className="input"
              placeholder="e.g. derivatives, cell biology — used for revision reminders"
              value={weakTopics}
              onChange={(e) => setWeakTopics(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Reminder</span>
            <input
              className="input"
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
            />
            <span style={styles.hint}>
              Browser notifications while NoteKeep is open (allow when prompted).
            </span>
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            {isEdit && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleMarkReviewed}
                disabled={saving}
                title="Record that you revised weak topics (resets weekly reminder)"
              >
                Mark topic reviewed
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const h = pad(d.getHours())
  const min = pad(d.getMinutes())
  return `${y}-${m}-${day}T${h}:${min}`
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px',
    backdropFilter: 'blur(4px)',
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    width: '100%',
    maxWidth: '720px',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: '22px',
    fontWeight: 600,
  },
  closeBtn: {
    padding: '6px 12px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'var(--text-2)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    color: 'var(--text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
  },
  titleInput: {
    fontSize: '18px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    padding: '12px 14px',
  },
  voiceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  voiceBtn: {
    fontSize: '13px',
    padding: '8px 14px',
  },
  voiceBtnActive: {
    borderColor: 'var(--accent)',
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-3)',
    marginTop: '-6px',
  },
  error: {
    color: 'var(--danger)',
    fontSize: '13px',
    padding: '10px 14px',
    background: 'rgba(239,68,68,0.1)',
    borderRadius: 'var(--radius)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingTop: '4px',
    flexWrap: 'wrap',
  },
}

export default NoteEditor
