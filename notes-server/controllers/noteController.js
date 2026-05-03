import Note from '../models/Note.js'
import { createNoteSchema, updateNoteSchema } from '../validators/schemas.js'

// ── GET /api/notes ────────────────────────────────
// Returns all notes for the authenticated user,
// pinned first, then newest first.
export const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id })
    .sort({ isPinned: -1, updatedAt: -1 })
    .lean()

  res.json(notes)
}

// ── POST /api/notes ───────────────────────────────
export const createNote = async (req, res) => {
  const body = createNoteSchema.parse(req.body)

  const note = await Note.create({ ...body, user: req.user._id })

  res.status(201).json(note)
}

// ── PUT /api/notes/:id ────────────────────────────
export const updateNote = async (req, res) => {
  const body = updateNoteSchema.parse(req.body)

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },  // ownership check
    { $set: body },
    { new: true, runValidators: true }
  )

  if (!note) {
    return res.status(404).json({ message: 'Note not found' })
  }

  res.json(note)
}

// ── DELETE /api/notes/:id ─────────────────────────
export const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,   // ownership check
  })

  if (!note) {
    return res.status(404).json({ message: 'Note not found' })
  }

  res.json({ message: 'Note deleted', id: req.params.id })
}
