import { Router } from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js'

const router = Router()

// All note routes require authentication
router.use(protect)

router.route('/')
  .get(getNotes)      // GET  /api/notes
  .post(createNote)   // POST /api/notes

router.route('/:id')
  .put(updateNote)    // PUT    /api/notes/:id
  .delete(deleteNote) // DELETE /api/notes/:id

export default router
