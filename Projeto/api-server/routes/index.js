var express = require('express');
var router = express.Router();
var Movie = require('../controllers/movie')
var Log = require('../controllers/log')
var New = require('../controllers/new')

router.get('/movies', function(req,res){

  // GET /api/movies?genre=X
  if(req.query['genre'] != undefined){
    Movie.selectGenre(req.query['genre'])
      .then(dados => {
        res.status(202).jsonp(dados)
      })
      .catch(e => {
        res.status(502).jsonp({error: e})
      })
  }
  // GET /api/movies
  else{
    Movie.list()
      .then(dados => {
        res.status(200).jsonp({dados: dados, level: req.level, username: req.username})
      })
      .catch(e => {
        res.status(500).jsonp({error: e})
      })
  }

})

router.get('/movies/search/:id', function(req,res){
  Movie.hasInTitle(req.params.id)
    .then(dados => {
      res.status(201).jsonp({dados: dados, level: req.level, username: req.username})
    })
    .catch(e => {
      res.status(501).jsonp({error: e})
    })
})

// GET /api/movies/:id
router.get('/movies/:id', function(req,res){
  Movie.singleMovie(req.params.id)
    .then(dados => {
      res.status(201).jsonp({dados: dados, level: req.level, username: req.username})
    })
    .catch(e => {
      res.status(501).jsonp({error: e})
    })
})

// ..............................................................

// GET /api/logs
router.get('/logs', function(req,res){
  Log.list()
    .then(dados => {
      res.status(201).jsonp({dados: dados, level: req.level, username: req.username})
    })
    .catch(e => {res.status(501).jsonp({error: e})})
})

// GET /api/logs/user/:id
router.get('/logs/user/:id', function(req,res){
  console.log(req.params.id)
  Log.userLogs(req.params.id)
    .then(dados => {res.status(201).jsonp({dados: dados})})
    .catch(e => {res.status(501).jsonp({error: e})})
})

// GET /api/logs/movie/:id
router.get('/logs/movie/:id', function(req,res){
  console.log(req.params.id)
  Log.movieLogs(req.params.id)
    .then(dados => {res.status(201).jsonp({dados: dados})})
    .catch(e => {res.status(501).jsonp({error: e})})
})

// POST /api/logs
router.post('/logs', function(req,res){
  console.log(req.body)
  Log.insertLog(req.body)
    .then(data => res.status(201).jsonp({dados: data}))
    .catch(e => res.status(500).jsonp({error: e}))
})

// POST /api/logs/edit
router.post('/logs/edit', function(req,res){
  if(req.level == 'admin' || req.level == 'producer'){
    console.log(req.body)
    Log.editLog(req.body)
      .then(data => res.status(201).jsonp({dados: data}))
      .catch(e => res.status(500).jsonp({error: e}))
  }
  else{res.status(501).jsonp({erro: 'Access denied!'})}
})

// GET /api/logs/:id
router.get('/logs/:id', function(req,res){
  console.log(req.params.id)
  Log.singleLog(req.params.id)
    .then(dados => {res.status(201).jsonp({dados: dados})})
    .catch(e => {res.status(501).jsonp({error: e})})
})

// DELETE api/logs/:id
router.delete('/logs/:id' , (req, res) => {
  if(req.level == 'admin' || req.level == 'producer'){
    Log.removeLog(req.params.id)
      .then(data => res.status(201).jsonp(data))
      .catch(err => res.status(500).jsonp(err))
  }
  else{res.status(501).jsonp({erro: 'Access denied!'})}
})

// ..............................................................

// GET /api/news
router.get('/news', function(req,res){
  New.list()
    .then(dados => {res.status(201).jsonp({dados: dados, level: req.level, username: req.username})})
    .catch(e => {res.status(501).jsonp({error: e})})
})

// POST /api/news
router.post('/news', function(req,res){

  if(req.level == 'admin'){
    spaces = /^\s*$/g

    if(req.body.description.match(spaces) || req.body.title.match(spaces)){
      res.status(400).jsonp({message: "Please fill up the entire form!"})
    }
    else{
      New.insertNews(req.body)
      .then(data => {res.status(201).jsonp({dados: data})})
      .catch(e => res.status(500).jsonp({error: e}))
    }
  }
  else{res.status(501).jsonp({erro: 'Access denied!'})}
})

// DELETE api/news/:id
router.delete('/news/:id' , (req, res) => {
  if(req.level == 'admin'){
    New.removeNews(req.params.id)
    .then(data => {res.status(201).jsonp({dados: data})})
    .catch(err => res.status(500).jsonp(err))
  }
  else{res.status(501).jsonp({erro: 'Access denied!'})}
})

// GET /api/news/:id
router.get('/news/:id', function(req,res){
  console.log(req.params.id)
  New.singleNews(req.params.id)
    .then(dados => {res.status(201).jsonp({dados: dados})})
    .catch(e => {res.status(501).jsonp({error: e})})
})

// POST /api/news/edit
router.post('/news/edit', function(req,res){
  if(req.level == 'admin'){
    console.log(req.body)
    New.editNews(req.body)
      .then(data => {res.status(201).jsonp({dados: data})})
      .catch(e => res.status(500).jsonp({error: e}))
  }
  else{res.status(501).jsonp({erro: 'Access denied!'})}
})

module.exports = router;