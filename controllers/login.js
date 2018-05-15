const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    console.log(user, req.body.password)
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
    res.status(200).send({ token, username: user.username, name: user.name })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'invalid login credentials' })
  }
})

module.exports = loginRouter
