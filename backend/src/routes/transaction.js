const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transaction')
const authMiddleware = require('../middlewares/auth')

router.post('/create', authMiddleware.ensureAuthenticated, transactionController.createTransaction)

module.exports = router
