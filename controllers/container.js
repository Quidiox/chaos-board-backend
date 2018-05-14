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
      res.status(400).json({ error: 'container title missing' })
    }
    const board = await Board.findById(req.params.boardId)
    const container = new Container({
      title: body.title,
      description: body.description,
      position: board.containers ? board.containers.length : 0
    })
    console.log(board.containers)
    const savedContainer = await container.save()
    board.containers.addToSet(savedContainer.id)
    await board.save()
    res.json(savedContainer)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'something went wrong' })
  }
})
/*
containerRouter.delete('/:containerId/:cardId', async (req, res) => {
  try {
    const container = await Container.findById(req.params.containerId).populate(
      'cards'
    )
    const cards = container.cards.filter(card => card.id !== req.params.cardId)
    container.cards = cards
    await container.save()
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error })
  }
})
*/
containerRouter.delete('/:boardId/:containerId', async (req, res) => {
  try {
    const container = await Container.findByIdAndRemove(req.params.containerId)
    await Board.update(
      { _id: req.params.boardId },
      { '$pull': { 'containers': req.params.containerId } },
      { safe: true }
    )
    const board = await Board.findById(req.params.boardId).populate(
      'containers'
    )
    container.cards.map(async id => await Card.findByIdAndRemove(id))
    board.containers.map(async c => {
        if (c.position > container.position) {
          c.position -= 1
          await c.save()
        }
        return c
      })
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id' })
  }
})

containerRouter.delete('/:containerId', async (req, res) => {
  try {
    await Container.findByIdAndRemove(req.params.containerId)
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'something failed with delete' })
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
    res.json({ success: 'move container' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id' })
  }
})

containerRouter.put('/addtonew', async (req, res) => {
  try {
    const body = req.body
    const container = await Container.findById(body.containerId)
    const card = await Card.findById(body.cardId)
    card.position = container.cards.length
    await card.save()
    container.cards.addToSet(card.id)
    await container.save()
    res.json({ success: 'add went well' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id' })
  }
})

containerRouter.put('/removefromold', async (req, res) => {
  try {
    const body = req.body
    const container = await Container.findById(body.containerId).populate(
      'cards'
    )
    const modifiedCards = container.cards.filter(
      card => card.id !== body.cardId
    )
    modifiedCards.forEach(async card => {
      if (card.position > body.itemIndex) {
        card.position -= 1
        console.log(card)
        await card.save()
      }
    })
    container.cards = modifiedCards
    await container.save()
    res.json({ success: 'remove went well' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'something went wrong' })
  }
})

containerRouter.put('/edit/:containerId', async (req, res) => {
  try {
    const updatedContainer = await Container.findByIdAndUpdate(
      req.params.containerId,
      req.body,
      { new: true }
    ).populate('cards')
    res.json(updatedContainer)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id or data' })
  }
})

module.exports = containerRouter
