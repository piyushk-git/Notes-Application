import jwt from 'jsonwebtoken'

/**
 * Sign a JWT for a given user.
 * Payload includes id, name, email so the frontend can
 * hydrate without a separate /me request.
 */
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
  )

export default generateToken
