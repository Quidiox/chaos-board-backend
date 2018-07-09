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

boardsRouter.put('/:boardId/addmember', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
    board.members.push(body.user.id)
    const savedBoard = await board.save()
    res.json(savedBoard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'adding member to board failed'})
  }
})

boardsRouter.put('/:boardId/removemember', async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
    board.members = board.members.filter(id => id !== req.params.boardId)
    const savedBoard = await board.save()
    res.json(savedBoard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'removing member from board failed'})
  }
})

boardsRouter.put('/:boardId', async (req, res) => {
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

boardsRouter.delete('/:boardId', async (req, res) => {
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

module.exports = boardsRouter
