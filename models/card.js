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

if (!cardSchema.options.toObject) cardSchema.options.toObject = {};
cardSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    title: ret.title,
    text: ret.text,
    position: ret.position
  }
}

cardSchema.post('init', function(doc) {
  doc.toObject()
})

const Card = mongoose.model('Card', cardSchema)

module.exports = Card
