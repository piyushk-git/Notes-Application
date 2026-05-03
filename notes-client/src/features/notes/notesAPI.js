import api from '../../services/api'

/** GET /api/notes */
export const fetchNotes = async () => {
  const { data } = await api.get('/notes')
  return data  // Note[]
}

/** POST /api/notes */
export const createNote = async (noteData) => {
  const { data } = await api.post('/notes', noteData)
  return data  // Note
}

/** PUT /api/notes/:id */
export const updateNote = async (id, noteData) => {
  const { data } = await api.put(`/notes/${id}`, noteData)
  return data  // Note
}

/** DELETE /api/notes/:id */
export const deleteNote = async (id) => {
  const { data } = await api.delete(`/notes/${id}`)
  return data
}
