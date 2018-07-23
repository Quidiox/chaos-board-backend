const mongoose = require('mongoose')

const boardSchema = new mongoose.Schema({
  title: String,
  containers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

if (!boardSchema.options.toObject) boardSchema.options.toObject = {}
boardSchema.options.toObject.transform = function(doc, ret, options) {
  return {
    id: ret._id,
    title: ret.title,
    containers: ret.containers,
    owner: ret.owner,
    members: ret.members
  }
}

boardSchema.post('init', function(doc) {
  doc.toObject()
})

const Board = mongoose.model('Board', boardSchema)

module.exports = Board
