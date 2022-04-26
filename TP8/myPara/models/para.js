const mongoose = require('mongoose')

var paraSchema = new mongoose.Schema({
    data: String, 
    para: String
})

// exportar o modelo
module.exports = mongoose.model('para', paraSchema)