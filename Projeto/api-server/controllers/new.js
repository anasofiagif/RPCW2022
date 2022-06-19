var New = require('../models/new')

// list news, sorted by date
module.exports.list = function(){
    return New
            .find()
            .sort({date: -1})
            .exec()
}

// inserts news
module.exports.insertNews = nn => {
    var n = new New(nn)
    return n.save()
}

// update news
module.exports.editNews = n => {
    console.log(n._id)
    let r = New.findOneAndUpdate({_id: n._id}, n, {new: true, strict:false}) 
    return r
}

// removes news
module.exports.removeNews = id => {
    return New.findByIdAndDelete(id).exec()
}

// return single news
module.exports.singleNews = function(id){
    return New
            .findOne({_id: id})
            .exec()
}