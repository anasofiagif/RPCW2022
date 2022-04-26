var express = require('express');
var router = express.Router();
var Para = require('../controllers/para')

router.get('/paras', function(req, res) {
  Para.listar()
      .then(dados => {
          res.status(200).jsonp(dados)
      })
      .catch(e => {
        res.status(500).jsonp({erro: e})
      })
});

router.post('/paras', function(req, res) {
  Para.inserir(req.body)
      .then(dados => {
          res.status(201).jsonp(dados)
      })
      .catch(e => {
          console.log(e)
          res.status(501).jsonp({erro: e})
      })
});

router.delete('/paras/:id', function(req, res) {
  Para.delete(req.params.id)
      .then(dados => {
          res.status(202).jsonp(dados)
      })
      .catch(e => {
          console.log(e)
          res.status(502).jsonp({erro: e})
      })
});

module.exports = router;
