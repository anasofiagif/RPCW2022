var express = require('express');
var router = express.Router();
var User = require('../controllers/user')

// GET /api/users
router.get('/users', function(req,res){

  if(req.level == 'admin'){
    User.list()
      .then(dados => {res.status(201).jsonp({users: dados,level: req.level, username: req.username})})
      .catch(e => {
        res.status(501).jsonp({erro: e})})
    }
  else{
    res.status(500).jsonp({error: 'Access denied!'})
  }

})

router.get('/user',function(req,res){
  res.status(202).jsonp({username: req.username, level: req.level})
})

// get api/incDl
router.get('/incDl/:id', function(req,res){
  User.incDl(req.params.id)
    .then(data => res.status(201).jsonp({dados: data}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/user/edit/:id', function(req,res){
  if(req.level == 'admin' || req.level == 'producer'){
    User.updateUser(req.body)
        .then( data => {res.status(200).jsonp({dados: data})})
        .catch(e=>{ res.status(500).jsonp({erro: e})})
  }
  else{
    res.status(501).jsonp({erro: 'Access denied!'})
  }
  
})

// GET /api/user/:id
router.get('/user/:id', function(req,res){
  if(req.level == 'admin' || req.level == 'producer'){
    User.lookup(req.params.id)
      .then(dados => {
        res.status(201).jsonp({dados: dados, level: req.level, username: req.username})
      })
      .catch(e => {
        res.status(501).jsonp({erro: e})
      })
  }
  else{
    res.status(501).jsonp({erro: 'Access denied!'})
  }
})

// DELETE api/user/:id
router.delete('/user/:id' , (req, res) => {
  if(req.level == 'admin'){
    User.removeUser(req.params.id)
      .then(data => {res.status(201).jsonp(data)})
      .catch(err => res.status(500).jsonp(err))
  }
  else{
    res.status(501).jsonp({erro: 'Access denied!'})
  }

})

  
module.exports = router;