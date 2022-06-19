var Movie = require('../models/movie')

// list movies with all the info, sorted by title
module.exports.list = function(){
    return Movie
            .find()
            .sort({title: 1})
            .exec()
}

// return a movie's complete information
module.exports.singleMovie = function(id){
    return Movie
            .findOne({_id: id})
            .exec()
}

// list movies that belong to a certain genre
module.exports.selectGenre = function(genre){
    return Movie
            .find({genres:{$in:[genre]}})
            .exec()
}

// list movies that contain a certain string on their name
module.exports.hasInTitle = function(string){
    console.log(string)
    return Movie
            .find({"title" : {$regex : string, '$options' : 'i'}})
            .exec()
}