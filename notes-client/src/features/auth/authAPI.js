import api from '../../services/api'

/**
 * POST /api/auth/register
 */
export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data  // { token, user }
}

/**
 * POST /api/auth/login
 */
export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data  // { token, user }
}
