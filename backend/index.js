const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()

// DOTENV
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

// MONGODB CONNECTION
const connectDB = require('./src/configs/mongo')
connectDB()

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

// CORS
app.use(
  cors({
    origin: 'http://localhost:3000', //* ADJUST ON PRODUCTION
    credentials: true,
    optionsSuccessStatus: 200
  })
)

// ROUTES
const branchRoutes = require('./src/routes/branch')
const userRoutes = require('./src/routes/user')
const patientRoutes = require('./src/routes/patient')
const transactionRoutes = require('./src/routes/transaction')
app.get('/', (req, res) => {
  res.send('Wafi Dental Care Backend Service!')
})
app.use('/api/branch', branchRoutes)
app.use('/api/user', userRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/transaction', transactionRoutes)

// ROUTE ERROR HANDLING
app.use((req, res, next) => {
  const error = new Error('Not found!')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

// SERVER
app.listen(process.env.PORT, () => {
  console.log('Server is running!')
})

module.exports = app
