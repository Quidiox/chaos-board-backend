const boardRouter = require('express').Router()
const Board = require('../models/board')

boardRouter.get('/:boardId/members', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
    res.json(board)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'failed to get board'})
  }
})

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

boardRouter.delete('/:boardId/:containerId', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId).populate('containers')
    if(req.user.id !== board.owner.toString()) return res.status(401).end()
    const filteredContainers = board.containers.filter(c => {
      return c.id !== req.params.containerId
    })
    board.containers = filteredContainers
    await board.save()
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'deleting board failed' })
  }
})


boardRouter.put('/:boardId/change', async (req, res) => {
  try {
    const { boardId, members } = req.body
    const board = await Board.findById(boardId)
    if(req.user.id !== board.owner.toString()) return res.status(401).end()
    const combined = [...new Set([req.user.id, ...members])]
    board.members = combined
    const savedBoard = await board.save()
    res.json(savedBoard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'adding member to board failed'})
  }
})

module.exports = boardRouter
