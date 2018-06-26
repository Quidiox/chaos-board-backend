const boardRouter = require('express').Router()
const Board = require('../models/board')
const Container = require('../models/container')
const Card = require('../models/card')

boardRouter.get('/:boardId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate({
      path: 'containers',
      populate: { path: 'cards', model: 'Card' }
    })
    res.json(board)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'requested board does not exist' })
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

boardRouter.delete('/:boardId/:containerId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate('containers')
    const filteredContainers = board.containers.filter(c => {
      return c.id !== req.params.containerId
    })
    board.containers = filteredContainers
    await board.save()
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'didnt succeed' })
  }
})

boardRouter.delete('/:boardId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate(
      'containers'
    )
    await board.containers.map(async container => {
      await container.cards.map(async card => {
        await Card.findByIdAndRemove(card)
      })
      await Container.findByIdAndRemove(container._id)
    })
    await Board.findByIdAndRemove(req.params.boardId)
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformed id' })
  }
})

module.exports = boardRouter
