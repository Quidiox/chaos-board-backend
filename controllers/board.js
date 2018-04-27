const boardRouter = require('express').Router()
const uuidv1 = require('uuid/v1')
const Container = require('../models/container')
const Card = require('../models/card')

boardRouter.get('/', async (req, res) => {
  try {
    const containers = await Container.find({})
    res.json(containers)
  } catch (error) {}
})

boardRouter.get('/:boardId', async (req, res) => {
  try {
    const containers = await Container.find({ boardId: req.params.boardId })
    const formattedContainers = containers.map(container => Container.format(container))
    res.json(formattedContainers)
  } catch (error) {
    console.log(error)
  }
})

boardRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.title) {
      res.status(400).json({ error: 'container missing' })
    }
    const container = new Container({
      title: body.title,
      description: body.description,
      position: body.position || 0,
      cards: [],
      boardId: body.boardId || uuidv1(),
      boardTitle: body.boardTitle,
      boardDescription: body.boardDescription
    })
    const savedContainer = await container.save()
    res.json(Container.format(savedContainer))
  } catch (error) {
    console.log(error)
  }
})

boardRouter.delete('/:containerId', async (req, res) => {
  try {
    await Container.findByIdAndRemove(req.params.containerId)
    response.status(204).end()
  } catch (error) {
    console.log(error)
    response.status(400).send({ error: 'malformatted id' })
  }
})

boardRouter.put('/:containerId', async (req, res) => {
  try {
    const updatedContainer = await Container.findByIdAndUpdate(
      req.params.containerId,
      req.body,
      { new: true }
    )
    res.json(Container.format(updatedContainer))
  } catch (error) {
    console.log(error)
    response.status(400).send({ error: 'malformatted id or missing data' })
  }
})

boardRouter.post('/:containerId/card', async (req, res) => {
  try {
    const body = req.body
    const card = new Card({
      title: body.title,
      text: body.text,
      description: body.description
    })
    const savedCard = await card.save()
    const updatedContainer = await Container.findByIdAndUpdate(req.params.containerId, )
    res.json(Card.format(savedCard))
  } catch (error) {
    console.log(error)
    res.status(400).json({error: 'adding new card failed'})
  }
})

boardRouter.put('/:containerId/card/:cardId')

module.exports = boardRouter
