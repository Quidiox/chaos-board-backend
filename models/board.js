const mongoose = require('mongoose')
const Container = require('./container')

const boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  containers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container' }]
})

boardSchema.statics.format = function({ _id, title, description, containers }) {
  return {
    id: _id,
    title,
    description,
    containers
  }
}

if (!boardSchema.options.toObject) boardSchema.options.toObject = {}
boardSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    title: ret.title,
    description: ret.description,
    containers: ret.containers
  }
}

boardSchema.post('init', function(doc) {
  doc.toObject()
})

const Board = mongoose.model('Board', boardSchema)

module.exports = Board
