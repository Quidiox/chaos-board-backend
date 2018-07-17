const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userRouter = require('express').Router()
const User = require('../models/user')
const Board = require('../models/board')
const Container = require('../models/container')
const Card = require('../models/card')

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

userRouter.get('/:boardId/members', async (req, res) => {
  try {
    const users = await User.find({ memberOf: req.params.boardId })
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'failed to get board members' })
  }
})

userRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .select('id username name memberOf')
      .populate('memberOf')
    res.json(users)
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'failed to get users' })
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
    const userForToken = {
      username: savedUser.username,
      id: savedUser.id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    res.json({ token, username: savedUser.username, name: savedUser.name, id: savedUser.id })
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
    const boards = await Board.find({ owner: req.user.id }).populate({
      path: 'containers',
      populate: { path: 'cards', model: 'Card' }
    })
    await boards.map(async board => {
      await board.containers.map(async container => {
        await container.cards.map(async card => {
          await Card.findByIdAndRemove(card)
        })
        await Container.findByIdAndRemove(container._id)
      })
      await Board.findByIdAndRemove(board.id)
    })
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
      const userForToken = {
        username: modifiedUser.username,
        id: modifiedUser.id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)
      return res.json({
        token,
        username: modifiedUser.username,
        name: modifiedUser.name,
        id: modifiedUser.id
      })
    }
    const modifiedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true
      }
    ).select('id username name memberOf')
    const userForToken = {
      username: modifiedUser.username,
      id: modifiedUser.id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    res.json({
      token,
      username: modifiedUser.username,
      name: modifiedUser.name,
      id: modifiedUser.id
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'updating user failed' })
  }
})

module.exports = userRouter
