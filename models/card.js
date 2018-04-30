const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  title: String,
  text: String,
  position: Number
})

cardSchema.statics.format = function({ _id, title, text, position }) {
  return {
    id: _id,
    title,
    text,
    position
  }
}

const Card = mongoose.model('Card', cardSchema)

module.exports = Card
