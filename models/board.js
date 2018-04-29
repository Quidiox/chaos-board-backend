const mongoose = require('mongoose')
const Container = require('./container')

boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  containers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container' }]
})

boardSchema.statics.format = ({ _id, title, description, containers }) => ({
  id: _id,
  title,
  description,
  containers
})

const Board = mongoose.model('Board', boardSchema)

module.exports = Board
