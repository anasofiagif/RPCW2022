const mongoose = require('mongoose')

var newSchema = new mongoose.Schema({    
    title: String,
    description: String,
    date: String,
    visible: String
  });

module.exports = mongoose.model('new', newSchema)