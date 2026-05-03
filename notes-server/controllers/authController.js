import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import { registerSchema, loginSchema } from '../validators/schemas.js'

// ── POST /api/auth/register ───────────────────────
export const register = async (req, res) => {
  // Validate
  const body = registerSchema.parse(req.body)

  // Duplicate email check (also guarded by unique index, but gives a cleaner message here)
  const exists = await User.findOne({ email: body.email })
  if (exists) {
    return res.status(409).json({ message: 'Email is already registered' })
  }

  const user  = await User.create(body)
  const token = generateToken(user)

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  })
}

// ── POST /api/auth/login ──────────────────────────
export const login = async (req, res) => {
  const body = loginSchema.parse(req.body)

  // password field excluded by default — re-select it
  const user = await User.findOne({ email: body.email }).select('+password')

  if (!user || !(await user.matchPassword(body.password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = generateToken(user)

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  })
}
