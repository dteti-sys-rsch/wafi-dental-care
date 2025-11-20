const { Client, LocalAuth } = require('whatsapp-web.js')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const express = require('express')
const QRCode = require('qrcode')
const morgan = require('morgan')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: 'remote',
    remotePath:
      'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
  },
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
})

let qrCodeData = ''

client.on('ready', () => {
  console.log('WhatsApp Client is ready!')
  qrCodeData = ''
})

client.on('qr', (qr) => {
  console.log('QR Received! Please scan the QR code to log in!')
  qrCodeData = qr
})

client.initialize()

client.on('message_create', (msg) => {
  if (msg.body === '!wafi') {
    msg.reply('Hello from Wafi Dental Care WhatsApp Web Client!')
  }
})

app.get('/', (req, res) => {
  res.send('Express server is running with WhatsApp Web Client!')
})

app.get('/qr', async (req, res) => {
  if (!qrCodeData) {
    return res.status(404).send('QR Code not yet available. Please wait...')
  }

  try {
    const qrCodeImageUrl = await QRCode.toDataURL(qrCodeData)
    res.send(`<img src="${qrCodeImageUrl}" alt="QR Code" />`)
  } catch (err) {
    console.error('Error generating QR code:', err)
    res.status(500).send('Error generating QR Code.')
  }
})

app.post('/send-message', async (req, res) => {
  const { number, message, secret } = req.body

  const validations = [
    [
      secret === process.env.WA_SECRET_KEY,
      'Forbidden! Invalid secret key!',
      403
    ],
    [number, 'Number is required!', 400],
    [message, 'Message is required!', 400],
    [/^\d+$/.test(number), 'Number must contain digits only.', 400],
    [!/^0[0-9].*$/.test(number), 'Number must be in country code format.', 400]
  ]

  for (const [condition, errorMessage, statusCode] of validations) {
    if (!condition) return res.status(statusCode).send(errorMessage)
  }

  try {
    await client.sendMessage(`${number}@c.us`, message)
    return res.status(200).send('Message sent!')
  } catch (error) {
    console.error('Error sending message:', error)
    return res.status(500).send('Failed to send message.')
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message ?? 'Something went wrong'
  })
})

app.listen(process.env.PORT, () => {
  console.log('Server is running!')
})
