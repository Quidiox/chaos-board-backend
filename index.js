const http = require('http')
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const jwt = require('express-jwt')
const config = require('./utils/config')
const boardRouter = require('./controllers/board')
const containerRouter = require('./controllers/container')
const cardRouter = require('./controllers/card')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

const app = express()
mongoose.connect(config.mongoURI, {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
})
mongoose.Promise = global.Promise

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(
  jwt({ secret: process.env.SECRET }).unless({
    path: ['/api/login', '/api/user/create']
  })
)
app.use('/api/login', loginRouter)
app.use('/api/user', userRouter)
app.use('/api/board', boardRouter)
app.use('/api/container', containerRouter)
app.use('/api/card', cardRouter)

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.log(err)
    res.status(401).json({ error: 'token invalid or missing' })
  }
  next(err)
})

app.use(function(err, req, res, next) {
  if (!err) return next()
  console.log(err)
  res.status(500).send('internal server error')
})

app.use(function(req, res, next) {
  res.json(404, 'Not found')
})

const PORT = config.port || 3001
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app,
  server
}
