var express = require('express');
var router = express.Router();
var axios = require('axios')


router.get('/', function(req, res, next) {
  axios.get("http://localhost:3000/musicas")
       .then(response => {
          var lista = response.data
          res.render('musicas', { musicas: lista });
       })
       .catch(function(erro){
          res.render('error', { error: erro });
       })
  
});

router.get('/musicas', function(req, res, next) {
  axios.get("http://localhost:3000/musicas")
       .then(response => {
          var lista = response.data
          res.render('musicas', { musicas: lista });
       })
       .catch(function(erro){
          res.render('error', { error: erro });
       })
  
});

router.get('/musicas/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?idM="+req.params.id)
       .then(response => {
         // os dados vêm na forma de lista, por isso passamos apenas o primeiro
         var info = response.data[0]
         res.render('musica', { musica: info});
       })
       .catch(function(erro){
          res.render('error', { error: erro });
       })
});

router.get('/musicas/prov/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?idP="+req.params.id)
       .then(response => {
         // os dados vêm na forma de lista, por isso passamos apenas o primeiro
         var info = response.data
         console.log(info)
         res.render('provs', { musicas: info});
       })
       .catch(function(erro){
          res.render('error', { error: erro });
       })
});

module.exports = router;
