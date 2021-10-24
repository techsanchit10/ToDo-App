const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  }
}, { versionKey: false });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;