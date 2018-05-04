const containerRouter = require('express').Router()
const Container = require('../models/container')
const Board = require('../models/board')
const Card = require('../models/card')

containerRouter.get('/', async (req, res) => {
  try {
    const containers = await Container.find({}).populate('cards')
    res.json(containers)
  } catch (error) {
    console.log(error)
    res.status(400).json('get request failed')
  }
})

containerRouter.get('/:containerId', async (req, res) => {
  try {
    const container = await Container.findById(req.params.containerId).populate(
      'cards'
    )
    res.json(container)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'malformed id' })
  }
})

containerRouter.post('/:boardId', async (req, res) => {
  try {
    const body = req.body
    if (!body.title) {
      res.status(400).json({ error: 'container missing' })
    }
    console.log('hello ', body)
    const container = new Container({
      title: body.title,
      description: body.description,
      position: body.position
    })
    const savedContainer = await container.save()
    const board = await Board.findById(req.params.boardId)
    await board.containers.push(savedContainer._id)
    await board.save()
    res.json(savedContainer)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'something went wrong' })
  }
})

containerRouter.delete('/:containerId', async (req, res) => {
  try {
    const container = await Container.findById(req.params.containerId)
    await container.cards.map(async card => {
      await Card.findByIdAndRemove(card._id)
    })
    await Container.findByIdAndRemove(container._id)
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id' })
  }
})

containerRouter.put('/move', async (req, res) => {
  try {
    const body = req.body
    const movedContainer = await Container.findById(body.containerId)
    const dragPosContainer = await Container.findById(body.dragPosContainerId)
    movedContainer.position = body.dragIndex
    dragPosContainer.position = body.hoverIndex
    await movedContainer.save()
    await dragPosContainer.save()
    res.json({ success: 'all went well' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id' })
  }
})

containerRouter.put('/:containerId', async (req, res) => {
  try {
    const updatedContainer = await Container.findByIdAndUpdate(
      req.params.containerId,
      req.body,
      { new: true }
    )
    res.json(updatedContainer)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id or data' })
  }
})

module.exports = containerRouter
