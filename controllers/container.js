const containerRouter = require('express').Router()
const Container = require('./Container')

containerRouter.get('/', async (req, res) => {
  try {
    const containers = await Container.find({}).populate('cards')
    const formattedContainers = containers.map(Container.format)
    res.json(formattedContainers)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'something went wrong' })
  }
})

containerRouter.get('/:boardId', async (req, res) => {
  try {
    const containers = await Container.find({
      boardId: req.params.boardId
    }).populate('cards')
    const formattedContainers = containers.map(Container.format)
    res.json(formattedContainers)
  } catch (error) {
    console.log(error)
    res.status(404).json({ error: 'board does not exist' })
  }
})

containerRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.title) {
      res.status(400).json({ error: 'container missing' })
    }
    const container = new Container({
      title: body.title,
      description: body.description,
      position: body.position || 0,
      cards: []
    })
    const savedContainer = await container.save()
    res.json(Container.format(savedContainer))
  } catch (error) {
    console.log(error)
    res.status(400).json({error: 'something went wrong'})
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
    res.status(400).send({ error: 'malformatted id' })
  }
})

containerRouter.put('/:containerId', async (req, res) => {
  try {
    const updatedContainer = await Container.findByIdAndUpdate(
      req.params.containerId,
      req.body,
      { new: true }
    )
    res.json(Container.format(updatedContainer))
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'malformatted id or data' })
  }
})

module.exports = containerRouter
