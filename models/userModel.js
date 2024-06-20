const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: false // Make this optional for Google users
  },
  password: {
    type: String,
    required: false // Make this optional for Google users
  },
  is_admin: {
    type: Boolean,
    default: false,
    required: true
  },
  is_blocked: {
    type: Boolean,
    default: false,
    required: true
  },
  googleId: {
    type: String,
    required: false // Only for Google users
  },
  displayName: {
    type: String,
    required: false // Only for Google users
  },
  profilePhoto: {
    type: String,
    required: false // Only for Google users
  }
});

module.exports = mongoose.model('User', userSchema);
