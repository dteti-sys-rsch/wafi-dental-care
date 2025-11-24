const jwt = require('jsonwebtoken')

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
