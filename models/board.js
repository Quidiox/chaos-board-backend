const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  containers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

if (!boardSchema.options.toObject) boardSchema.options.toObject = {}
boardSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    title: ret.title,
    description: ret.description,
    containers: ret.containers,
    user: ret.user
  }
}

boardSchema.post('init', function(doc) {
  doc.toObject()
})

const Board = mongoose.model('Board', boardSchema)

module.exports = Board
