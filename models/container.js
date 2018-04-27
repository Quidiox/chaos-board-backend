const mongoose = require('mongoose')
const Card = require('./card')

const containerSchema = mongoose.Schema({
  title: String,
  description: String,
  position: Number,
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  boardTitle: String,
  boardDescription: String,
  boardId: String
})

containerSchema.statics.format = ({
  _id,
  title,
  description,
  position,
  cards,
  boardId,
  boardTitle,
  boardDescription
}) => ({
  id: _id,
  title,
  description,
  position,
  cards,
  boardId,
  boardTitle,
  boardDescription
})

const Container = mongoose.model('Container', containerSchema)

module.exports = Container
