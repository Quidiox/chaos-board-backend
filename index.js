const express = require('express')
const app = express()
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const data = require('./db.json')
const config = require('./utils/config')

app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>')
})

app.get('/containers', (req, res) => {
  res.json(data)
})

const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
