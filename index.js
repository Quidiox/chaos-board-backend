const http = require('http')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const data = require('./db.json')
const config = require('./utils/config')

const app = express()
mongoose.connect(config.mongoURI)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>')
})

app.get('/containers', (req, res) => {
  res.json(data)
})

const PORT = config.port

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
