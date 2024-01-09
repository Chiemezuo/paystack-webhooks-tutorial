const express = require('express')
const cors = require('cors')
const { default: axios } = require('axios')
require('dotenv').config()
const crypto = require('crypto')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

const initializationUrl = 'https://api.paystack.co/transaction/initialize'
const headers = {
  Authorization: `BEARER ${process.env.PAYSTACK_SECRET_KEY}`,
  'Content-Type': 'application/json',
}

// default page
app.get('/', (req, res) => {
  return res.send('Welcome to the Paystack tutorial')
})

// the route for processing a payment
app.post('/fund', async (req, res) => {
  const payload = {
    email: req.body.email,
    amount: req.body.amount
  }

  try {
    const response = await axios.post(initializationUrl, payload, { headers })
    return res.status(201).json({ status: true, data: response.data })
  } catch(e) {
    return res.status(400).json({ status: false, message: 'Funding failed' })
  }
})

// the Webhook for receiving Paystack's response
app.post('/paystack-webhook', async (req, res) => {
  const paystackSignature = req.headers['x-paystack-signature']
  const secret = process.env.PAYSTACK_SECRET_KEY

  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex')
  if (hash == paystackSignature) {
    
    // Retrieve the request's body
    const event = req.body
    // Do something with the event ...

    // You can log to the console to be sure
    console.log('The webhook was called with event:', event)
  }

  // A status response of 200 must be sent back to the Paystack 
  res.status(200).json({
    status: true,
    message: 'Received Paystack Event'
  });

})

// handling invalid routes
app.use('*', (req, res) => {
  return res.send('Invalid route')
})

// listen on any env port of choice
app.listen(port, () => {
  console.log(`Running on port ${port}`)
})