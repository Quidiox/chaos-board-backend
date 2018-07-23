const mongoose = require('mongoose')
const Card = require('./card')

const containerSchema = new mongoose.Schema({
  title: String,
  position: Number,
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }]
})

if (!containerSchema.options.toObject) containerSchema.options.toObject = {}
containerSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    title: ret.title,
    position: ret.position,
    cards: ret.cards
  }
}

containerSchema.post('init', function(doc) {
  doc.toObject()
})

const Container = mongoose.model('Container', containerSchema)

module.exports = Container
