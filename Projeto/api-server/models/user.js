const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: false},
    description: {type: String, required: false},
    level: String,
    dlCounter: {type:Number,default:0}
});

module.exports = mongoose.model('user', userSchema)