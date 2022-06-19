var Log = require('../models/log')

// list logs, sorted by _id
module.exports.list = function(){
    return Log
            .find()
            .sort({_id: 1})
            .exec()
}

// return a log complete information
module.exports.singleLog = function(id){
    return Log
            .findOne({_id: id})
            .exec()
}

// list logs that belong to a certain user
module.exports.userLogs = function(user){
    return Log
            .find({user: user})
            .sort({date: -1})
            .exec()
}

// list logs that belong to a certain movie
module.exports.movieLogs = function(movie){
    return Log
            .find({idMovie: movie})
            .sort({date: -1})
            .exec()
}

// inserts a new log in the database
module.exports.insertLog = l => {
    var n = new Log(l)
    return n.save()
}

// edits a log from the database
module.exports.editLog = l => {
    let r = Log.findOneAndUpdate({_id: l._id}, l, {new: true, strict:false}) 
    return r
}

// removes a log
module.exports.removeLog = id => {
    return Log.findByIdAndDelete(id).exec()
}
