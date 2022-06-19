const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: false},
    description: {type: String, required: false},
    level: String
  });

module.exports = mongoose.model('user', userSchema)