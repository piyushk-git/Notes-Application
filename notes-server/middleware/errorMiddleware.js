/**
 * Global error handler — must be the LAST middleware in app.js.
 *
 * Handles:
 *  - Zod validation errors
 *  - Mongoose CastError (bad ObjectId)
 *  - Mongoose duplicate key (E11000)
 *  - Mongoose validation errors
 *  - JWT errors (caught earlier in authMiddleware but included for safety)
 *  - Generic server errors
 */
const errorHandler = (err, req, res, next) => {
  // Log in dev, suppress in prod
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err)
  }

  // ── Zod validation ────────────────────────────────
  if (err.name === 'ZodError') {
    const messages = err.errors.map((e) => e.message).join('; ')
    return res.status(400).json({ message: messages, errors: err.errors })
  }

  // ── Mongoose bad ObjectId ─────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` })
  }

  // ── Mongoose duplicate key ────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({ message: `${field} is already in use` })
  }

  // ── Mongoose validation ───────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join('; ')
    return res.status(400).json({ message: messages })
  }

  // ── Known HTTP errors (thrown manually) ───────────
  const status = err.statusCode ?? err.status ?? 500
  const message = err.message ?? 'Internal server error'
  res.status(status).json({ message })
}

export default errorHandler
