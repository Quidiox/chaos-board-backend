const mongoose = require('mongoose')
const Container = require('./container')

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  memberOf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Container' }]
})

userSchema.statics.format = ({ _id, username, password, memberOf }) => ({
  id: _id,
  username,
  password,
  memberOf
})

const User = mongoose.model('User', userSchema)

module.exports = User
