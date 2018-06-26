const boardsRouter = require('express').Router()
const Board = require('../models/board')

boardsRouter.get('/:userId', async (req, res) => {
  try {
    const boards = await Board.find({ members: req.params.userId })
    res.json(boards)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'something went wrong' })
  }
})

boardsRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    const board = new Board({
      title: body.title,
      description: body.description,
      owner: req.user.id,
      members: [req.user.id]
    })
    const savedBoard = await board.save()
    res.json(savedBoard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'something went wrong when creating a board' })
  }
})

module.exports = boardsRouter
