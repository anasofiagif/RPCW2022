var express = require('express');
var logger = require('morgan');
var jsonfile = require('jsonfile')
var fs = require('fs')
var path = require('path');

var multer = require('multer')
var upload = multer({dest: 'uploads'})

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {

  var d = new Date().toISOString().substring(0,16)
  var files = jsonfile.readFileSync('./dbFiles.json')
  res.render('mainPage', {files: files, date: d });

})

app.post('/', upload.single('myFile'), (req, res) => {

  let oldPath = __dirname + '/' + req.file.path
  let newPath = __dirname + '/fileSystem/' + req.file.originalname

  if(!fs.existsSync(newPath)){

    fs.rename(oldPath, newPath, erro => {
      if(erro) throw erro
    })

    var d = new Date().toISOString().substring(0,16)
    var files = jsonfile.readFileSync('./dbFiles.json')

    files.push({
      date: d,
      name: req.file.originalname,
      description: req.body.description,
      mimetype: req.file.mimetype,
      size: req.file.size
    })

    jsonfile.writeFileSync('./dbFiles.json', files)
    res.redirect('/')

  }  
  else{
    fs.unlinkSync(oldPath)
    res.render('error', {error: "There's a file named " + req.file.originalname + " already :("})
  }

})

app.post('/delete', function(req, res) {

  var files = jsonfile.readFileSync('./dbFiles.json')
  id = 0
  
  for (const file of files){

      if(file.name == req.query.id){
        files.splice(id, 1); 
        jsonfile.writeFileSync('./dbFiles.json', files)
        break;
      }

    id++ 

  }

  fs.unlinkSync(__dirname + '/fileSystem/' + req.query.id)
  res.redirect('/')

});


app.listen(1441, () => console.log("Server listening on port 1441..."))

module.exports = app;