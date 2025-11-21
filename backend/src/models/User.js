const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  role: {
    type: String,
    enum: ['OWNER', 'MANAGER', 'STAFF'],
    default: 'STAFF',
    required: true
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
