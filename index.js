process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen

require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const errorHandling = require('./api/utils/errorHandling.js')

// Start database connection. MongoDB server must be running

;(async function dbConnect () {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`, {
      dbName: `${process.env.MONGODB_NAME}`
    })
    console.log('Conectado a la Base de datos')
  } catch (error) {
    throw new Error('Error conectando en la base de datos')
  }
})()

// Starts express server.

const app = express()

try {
  app
    .use(cors())
    .use(morgan('dev'))
    .use(express.json())
    .use('/api', require('./api/routes'))
    .use('/', (req, res) => {
      res.send('API running ok')
    })
    .use(errorHandling)
    .listen(process.env.EXPRESS_PORT, () => {
      console.info('\n\n' + '>'.repeat(40))
      console.info('💻  API en linea')
      console.info(`📡  Ruta: ${process.env.EXPRESS_URL}:${process.env.EXPRESS_PORT}`)
      console.info('>'.repeat(40) + '\n')
    })
} catch (error) {
  throw new Error(`Error iniciando Express: ${error}`)
}
