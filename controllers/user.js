const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('memberOf')
    res.json(users)
  } catch (error) {
    console.log(error)
    res.json(error)
  }
})

userRouter.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('id username name memberOf')
      .populate('memberOf')
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'failed to get user' })
  }
})

userRouter.post('/create', async (req, res) => {
  try {
    const { username, name, password } = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash
    })
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(400).json({ error: 'username exists' })
    } else {
      res.status(500).json({ error: 'creating user failed' })
    }
  }
})

userRouter.delete('/:userId', async (req, res) => {
  try {
    const token = req.user.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id || decodedToken.id !== req.params.userId) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    await User.findByIdAndRemove(req.params.userId)
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'deleting user failed' })
  }
})

userRouter.put('/:userId', async (req, res) => {
  try {
    const { password } = req.body
    if (password) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      const user = new User({
        username: req.body.username,
        name: req.body.name,
        passwordHash
      })
      const modifiedUser = await User.findByIdAndUpdate(
        req.params.userId,
        user,
        {
          new: true
        }
      ).select('id username name memberOf')
      return res.json(modifiedUser)
    }
    console.log(req.body)
    const modifiedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true
      }
    ).select('id username name memberOf')
    res.json(modifiedUser)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'updating user failed' })
  }
})

module.exports = userRouter
