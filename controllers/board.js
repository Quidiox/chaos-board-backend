const boardRouter = require('express').Router()
const Board = require('../models/board')
const Container = require('../models/container')

boardRouter.get('/', async (req, res) => {
  try {
    const boards = await Board.find({}).populate('containers')
    const formattedBoards = boards.map(Board.format)
    res.json(formattedBoards)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'something went wrong' })
  }
})

boardRouter.get('/:boardId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate(
      'containers'
    )
    res.json(Board.format(board))
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'requested board does not exist' })
  }
})

boardRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    const board = new Board({
      title: body.title,
      description: body.description
    })
    const savedBoard = await board.save()
    res.json(Board.format(savedBoard))
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'something went wrong when adding board' })
  }
})

boardRouter.put('/:boardId', async (req, res) => {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.boardId,
      req.body,
      { new: true }
    )
    res.json(updatedBoard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'something went wrong while editing board' })
  }
})

boardRouter.delete('/:boardId', async (req, res) => {
  try {
    await Board.remove({_id: req.params.boardId})
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({error: 'malformed id'})
  }
})

module.exports = boardRouter
