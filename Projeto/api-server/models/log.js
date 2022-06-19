const mongoose = require('mongoose')

var logSchema = new mongoose.Schema({    
    user: String,
    idMovie: String,
    movie: String,
    rating: String,
    review: String,
    like: String,
    date: String
  });

module.exports = mongoose.model('log', logSchema)