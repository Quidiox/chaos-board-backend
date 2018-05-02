const mongoose = require('mongoose')
const Container = require('./container')

const boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  containers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container' }]
})

boardSchema.statics.format = function({ _id, title, description, containers }) {
  return {
    _id,
    title,
    description,
    containers
  }
}

const Board = mongoose.model('Board', boardSchema)

module.exports = Board
