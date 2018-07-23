const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  title: String,
  position: Number
})

if (!cardSchema.options.toObject) cardSchema.options.toObject = {};
cardSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    title: ret.title,
    position: ret.position
  }
}

cardSchema.post('init', function(doc) {
  doc.toObject()
})

const Card = mongoose.model('Card', cardSchema)

module.exports = Card
