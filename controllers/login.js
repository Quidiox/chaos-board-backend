const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    const passwordsMatch =
      user === null
        ? false
        : await bcrypt.compare(req.body.password, user.passwordHash)

    if (!(user && passwordsMatch)) {
      res.status(401).send({ error: 'invalid username or password' })
    }
    const userForToken = {
      username: user.username,
      id: user.id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    res.json({ token, username: user.username, name: user.name, id: user.id })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'invalid login credentials' })
  }
})

loginRouter.post('/verifytoken', async (req, res) => {
  try {
    const userExists = await User.findById(req.user.id)
    if (!req.user.id || !userExists || req.user.id !== userExists.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    res.json({ success: 'token is valid' })
  } catch (error) {
    console.log(error)
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'something went wrong...' })
    }
  }
})

module.exports = loginRouter
