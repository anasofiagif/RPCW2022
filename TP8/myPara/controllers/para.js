var Para = require('../models/para')

module.exports.listar = function(){
    return Para
            .find()
            .exec()
}

module.exports.inserir = function(p){
    var d = new Date()
    p.data = d.toISOString().substring(0,16)
    var novo = new Para(p)
    console.log(novo)
    return novo.save()
}

module.exports.delete = function(i) {
    Para.findByIdAndRemove(i).exec()
}
