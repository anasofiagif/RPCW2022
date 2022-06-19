const mongoose = require('mongoose')

var movieSchema = new mongoose.Schema({
    _id: Number,
    title: String, 
    year: Number,
    runtime: Number,
    overview: String,
    studios: [String],
    countries: [String],
    language: [String],
    director: [String],
    cast: [String],
    genres: [String]
})

// exportar o modelo
module.exports = mongoose.model('movie', movieSchema)