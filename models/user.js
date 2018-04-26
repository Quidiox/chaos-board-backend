const mongoose = require('mongoose')
const Container = require('./container')

const User = mongoose.model('User', {
  username: String,
  password: String,
  memberOf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container' }]
})

module.exports = User
