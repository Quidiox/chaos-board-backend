const mongoose = require('mongoose')

const Card = mongoose.model('Card', {
  title: String,
  text: String,
  position: Number
})

module.exports = Card
