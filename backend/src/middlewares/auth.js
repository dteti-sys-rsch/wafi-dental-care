const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.ensureAuthenticated = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies && req.cookies.AuthToken) {
    token = req.cookies.AuthToken
  } else {
    return res.status(401).json({ message: 'Missing authentication token!' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({
        message: 'Invalid token'
      })
    }

    req.userId = decodedToken.userId

    next()
  })
}

exports.ensureDoctor = async (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (user.role !== 'DOCTOR') {
        return res.status(403).json({ message: 'Access denied: Doctors only' })
      }
      next()
    })
    .catch((err) => {
      res.status(500).json({ message: 'Server error', error: err.message })
    })
}
