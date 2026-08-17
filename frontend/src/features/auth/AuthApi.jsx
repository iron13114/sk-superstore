import { axiosi } from '../../config/axios'

const formatError = (error) => {
  const message = error.response?.data?.message || error.message || 'Network error. Please try again.'
  const customError = new Error(message)
  if (error.response?.data) {
    Object.assign(customError, error.response.data)
  }
  return customError
}

export const signup = async (cred) => {
  try {
    const res = await axiosi.post('auth/signup', cred)
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const verifyEmail = async (token) => {
  try {
    const res = await axiosi.get(`/auth/verify-email/${token}`)
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const login = async (cred) => {
  try {
    const res = await axiosi.post('auth/login', cred)
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const verifyOtp = async (cred) => {
  try {
    const res = await axiosi.post('auth/verify-otp', cred)
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const resendOtp = async (cred) => {
  try {
    const res = await axiosi.post('auth/resend-otp', cred)
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const forgotPassword = async (cred) => {
  try {
    const res = await axiosi.post('auth/forgot-password', cred)
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const resetPassword = async (cred) => {
  try {
    const res = await axiosi.post('auth/reset-password', cred)
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const checkAuth = async () => {
  try {
    const res = await axiosi.get('auth/check-auth')
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const logout = async () => {
  try {
    const res = await axiosi.get('auth/logout')
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}

export const googleLogin = async (cred) => {
  try {
    const res = await axiosi.post('/auth/google', { cred })
    return res.data
  } catch (error) {
    throw formatError(error)
  }
}