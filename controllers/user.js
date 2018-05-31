const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

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

userRouter.post('/', async (req, res) => {
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
// TODO user can only delete his own account
userRouter.delete('/:userId', async (req, res) => {
  try {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!token ||
      !decodedToken.id ||
      decodedToken.id !== req.params.userId) {
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
    console.log(req.body)
    const token = getTokenFrom(req)
    // const user = User.findByIdAndUpdate(req.params.userId, req.body, {
    //   new: true
    // })
    // TODO user can only edit his own account and if passwordHash generated from the password doesn't match with the one in db need to generate new
    //res.json(user)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'updating user failed' })
  }
})

module.exports = userRouter
