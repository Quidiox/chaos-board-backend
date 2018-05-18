const cardRouter = require('express').Router()
const Container = require('../models/container')
const Card = require('../models/card')

cardRouter.get('/', async (req, res) => {
  try {
    const cards = await Card.find({})
    res.json(cards)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'get cards request failed' })
  }
})

cardRouter.delete('/:cardId', async (req, res) => {
  try {
    await Card.findByIdAndRemove(req.params.cardId)
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: 'malformed id' })
  }
})

cardRouter.post('/:containerId', async (req, res) => {
  try {
    const body = req.body
    const container = await Container.findById(req.params.containerId)
    const tempCard = new Card({
      title: body.title,
      text: body.text,
      position: container.cards ? container.cards.length : 0
    })
    const card = await tempCard.save()
    await container.cards.addToSet(card.id)
    await container.save()
    res.json({ card, containerId: req.params.containerId })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'adding new card failed' })
  }
})

cardRouter.delete('/:containerId/:cardId', async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId)
    await Container.update(
      { _id: req.params.containerId },
      { $pull: { cards: req.params.cardId } },
      { safe: true }
    )
    const container = await Container.findById(req.params.containerId).populate(
      'cards'
    )
    await container.cards.map(async c => {
      if (c.position > card.position) {
        c.position -= 1
        c.save()
      }
    })
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'deleting card failed' })
  }
})

cardRouter.put('/edit/:cardId', async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      req.body,
      { new: true }
    )
    res.json(updatedCard)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id or data' })
  }
})

cardRouter.put('/move', async (req, res) => {
  try {
    const { hoverIndex, dragIndex, cardId, containerId } = req.body
    const movedCard = await Card.findById(cardId)
    const container = await Container.findById(containerId).populate('cards')
    movedCard.position = hoverIndex
    if (hoverIndex < dragIndex) {
      container.cards.forEach(async card => {
        if (card.position < dragIndex && card.position >= hoverIndex) {
          card.position += 1
          await card.save()
        }
      })
    } else {
      container.cards.forEach(async card => {
        if (card.position > dragIndex && card.position <= hoverIndex) {
          card.position -= 1
          await card.save()
        }
      })
    }
    await movedCard.save()
    res.json({ success: 'all went well' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id' })
  }
})

module.exports = cardRouter
