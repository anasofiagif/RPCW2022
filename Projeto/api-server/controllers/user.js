var User = require('../models/user')

// return a user's complete information
module.exports.lookup = uname => {
    return User
        .findOne({username: uname})
        .exec()
}

// list users with all the info, sorted by username
module.exports.list = function(){
    return User
            .find()
            .sort({username: 1})
            .exec()
}

// update user
module.exports.updateUser = function(u){
    console.log(u)
    let r =User.findOneAndUpdate({username: u.username}, u, {new: true, strict:false}) 
    console.log(r)
    return r
}

// removes user
module.exports.removeUser = uname => {
    return User.findOneAndDelete({username: uname}).exec()
}
module.exports.incDl = function(username){
    return User.findOneAndUpdate({username: username}, { $inc: { dlCounter: 1}}, {new: true, strict:false}) 
}
