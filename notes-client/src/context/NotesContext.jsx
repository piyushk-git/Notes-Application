import { createContext, useState, useCallback } from 'react'
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../features/notes/notesAPI'

export const NotesContext = createContext(null)

function sortNotes(list) {
  return [...list].sort((a, b) => {
    if (Boolean(a.isPinned) !== Boolean(b.isPinned)) return Number(b.isPinned) - Number(a.isPinned)
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
  })
}

export const NotesProvider = ({ children }) => {
  const [notes, setNotes]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const loadNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNotes()
      setNotes(sortNotes(data))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [])

  const addNote = useCallback(async (noteData) => {
    const newNote = await createNote(noteData)
    setNotes((prev) => sortNotes([newNote, ...prev.filter((n) => n._id !== newNote._id)]))
    return newNote
  }, [])

  const editNote = useCallback(async (id, noteData) => {
    const updated = await updateNote(id, noteData)
    setNotes((prev) => sortNotes(prev.map((n) => (n._id === id ? updated : n))))
    return updated
  }, [])

  const removeNote = useCallback(async (id) => {
    await deleteNote(id)
    setNotes((prev) => prev.filter((n) => n._id !== id))
  }, [])

  return (
    <NotesContext.Provider
      value={{ notes, loading, error, loadNotes, addNote, editNote, removeNote }}
    >
      {children}
    </NotesContext.Provider>
  )
}
