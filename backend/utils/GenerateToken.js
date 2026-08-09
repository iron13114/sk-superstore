require('dotenv').config()
const jwt = require('jsonwebtoken')

exports.generateToken = (payload, passwordReset = false) => {
    const expiresIn = process.env.JWT_EXPIRATION || '7d'
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn })
}