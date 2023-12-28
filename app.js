const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.PORT

// a default page
app.get('/', (req, res) => {
  return res.send('Welcome to the Paystack tutorial')
})

// handling invalid routes
app.use('*', (req, res) => {
  return res.send('Invalid route')
})

// listen on your port of choice
app.listen(port, () => {
  console.log(`Running on port ${port}`)
})