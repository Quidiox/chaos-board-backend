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


boardRouter.put('/:boardId/addmember', async (req, res) => {
  try {
    const { boardId, members } = req.body
    const board = await Board.findById(boardId)
    const combined = [...new Set([...members, ...board.members])]
    board.members = combined
    const savedBoard = await board.save()
    res.json(savedBoard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'adding member to board failed'})
  }
})

boardRouter.put('/:boardId/removemember', async (req, res) => {
  try {
    const {boardId, members} = req.body
    const board = await Board.findById(req.params.boardId)
    board.members = board.members.filter(id => id !== req.params.boardId)
    const savedBoard = await board.save()
    res.json(savedBoard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'removing member from board failed'})
  }
})

module.exports = boardRouter
