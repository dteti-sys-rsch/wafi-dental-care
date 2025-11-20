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

app.get('/send-message', async (req, res) => {
  const { number, message, secret } = req.query

  if (secret !== process.env.WA_SECRET_KEY) {
    return res.status(403).send('Forbidden! Invalid secret key!')
  }

  if (!number || !message) {
    return res.status(400).send('Number and message are required!')
  }

  try {
    await client.sendMessage(`${number}@c.us`, message)
    res.status(200).send('Message sent!')
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).send('Failed to send message.')
  }
})

app.use((err, res) => {
  ;``
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server.'
  })
})

app.listen(process.env.PORT, () => {
  console.log('Server is running!')
})
