var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var jwt = require('jsonwebtoken')

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/FilmLog', 
      { useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB...'));
db.once('open', function() {
  console.log("Successfully connected to MongoDB...")
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Verifica se o pedido veio com o token de acesso
app.use(function(req, res, next){
  var myToken = req.query.token || req.body.token
  if(myToken){
    if(myToken=='undefined'){
      req.level = 'not logged'
      req.username = null
      next()
    }
    else{
      jwt.verify(myToken, "RPCW2022", function(e, payload){  //em vez do segredo podemos usar a chave publica
        if(e){
          req.level = 'invalid' 
          req.username = null
          next()
          //res.status(403).jsonp({error: e})
        }
        else{
          req.level = payload.level //adiciona level ao request
          req.username = payload.username
          next()
        }
      })
    }
  }
  else{
    res.status(401).jsonp({error: "Token does not existe!"})
  }
})

app.use('/api', indexRouter);
app.use('/api', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).jsonp({error: err.message})
});

module.exports = app;
