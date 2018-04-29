const http = require('http')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const data = require('./db.json')
const config = require('./utils/config')
const boardRouter = require('./controllers/board')
const containerRouter = require('./controllers/container')
const cardRouter = require('./controllers/card')

const app = express()
mongoose.connect(config.mongoURI)
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())

app.use('/api/board', boardRouter)
app.use('/api/container', containerRouter)
app.use('/api/card', cardRouter)

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
