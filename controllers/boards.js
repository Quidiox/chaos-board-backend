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

module.exports = boardsRouter
