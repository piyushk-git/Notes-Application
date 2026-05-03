import { useContext } from 'react'
import { NotesContext } from '../context/NotesContext'

const useNotes = () => {
  const ctx = useContext(NotesContext)
  if (!ctx) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return ctx
}

export default useNotes
