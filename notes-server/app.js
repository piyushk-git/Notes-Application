import express    from 'express'
import cors       from 'cors'
import 'express-async-errors'   // patches async errors into next(err)

import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import errorHandler from './middleware/errorMiddleware.js'

const app = express()

// ── CORS ──────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}))

// ── Body parsers ──────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

// ── Health check ──────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV })
})

// ── Routes ────────────────────────────────────────
app.use('/api/auth',  authRoutes)
app.use('/api/notes', noteRoutes)

// ── 404 handler ───────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// ── Global error handler (must be last) ───────────
app.use(errorHandler)

export default app
