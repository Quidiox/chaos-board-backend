const cardRouter = require('express').Router()
const Card = require('../models/card')

cardRouter.post('/:containerId/card', async (req, res) => {
  try {
    const body = req.body
    const card = new Card({
      title: body.title,
      text: body.text,
      position: body.position
    })
    const savedCard = await card.save()
    const container = await Container.findById(req.params.containerId)
    await container.cards.push(savedCard._id)
    await container.save()
    res.json(Card.format(savedCard))
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'adding new card failed' })
  }
})

cardRouter.delete('/:containerId/card/:cardId', async (req, res) => {
  try {
    await Card.findByIdAndRemove(req.params.cardId)
    await Container.update(
      { _id: req.params.containerId },
      { $pull: { cards: req.params.cardId } }
    )
    res.status(204).end()
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'deleting card failed' })
  }
})

cardRouter.put('/:containerId/card/:cardId', async (req, res) => {
  try {
    const body = req.body
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      req.body,
      { new: true }
    )
    res.json(Card.format(updatedCard))
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'malformatted id or data' })
  }
})

module.exports = cardRouter
