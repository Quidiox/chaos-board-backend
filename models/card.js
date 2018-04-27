const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  title: String,
  text: String,
  position: Number
})

cardSchema.statics.format = ({ _id, title, text, position }) => ({
  id: _id,
  title,
  text,
  position
})

const Card = mongoose.model('Card', cardSchema)

module.exports = Card
