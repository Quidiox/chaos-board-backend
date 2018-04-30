const mongoose = require('mongoose')
const Card = require('./card')

const containerSchema = new mongoose.Schema({
  title: String,
  description: String,
  position: Number,
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
})

containerSchema.statics.format = function({
  _id,
  title,
  description,
  position,
  cards
}) {
  return { id: _id, title, description, position, cards }
}

const Container = mongoose.model('Container', containerSchema)

module.exports = Container
