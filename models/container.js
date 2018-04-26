const mongoose = require('mongoose')
const Card = require('./card')

const Container = mongoose.model('Container', {
  title: String,
  description: String,
  position: Number,
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  boardTitle: String,
  boardDescription: String,
  boardId: String
})

module.exports = Container
