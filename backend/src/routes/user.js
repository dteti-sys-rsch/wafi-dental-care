const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const authMiddleware = require('../middlewares/auth')

router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)
router.get('/', authMiddleware.ensureAuthenticated, userController.getAllUsers)

module.exports = router
