import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/**
 * protect — verifies Bearer JWT and attaches req.user.
 * Throws 401 if missing, invalid, or expired.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach a lean user object — avoids leaking password hash
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    next()
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError' ? 'Session expired — please log in again'
      : 'Invalid token'
    return res.status(401).json({ message })
  }
}

export default protect
