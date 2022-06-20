var express = require('express');
var router = express.Router();
var axios = require('axios')
var multer  = require('multer')
const path = require('node:path')
const fs = require('fs')
//const { parse }= require('fast-csv')
const csv = require('fast-csv')
const { EOL } = require('os');
//const e = require('express');
const BagIt = require('bagit-fs')
const { zip } = require('zip-a-folder');

router.get('/', function(req, res) {
  axios.get('http://localhost:4445/api/news/?token=' + req.cookies.token)
       .then(info => {
          u = info.data.username
          l = info.data.level
          news = info.data.dados
          res.render('mainpage', {news: news, username: u, level: l})
        })
        .catch(e => {res.render('error', {error: e})})
});

router.get('/films', function(req, res) {
  axios.get('http://localhost:4445/api/movies?token=' + req.cookies.token)
      .then(d => {
        var list = d.data.dados
        var l = d.data.level
        var u = d.data.username
        res.render('films', {films: list, level: l, username: u})
      })
      .catch(e => res.render('error', {error: e}))
});

router.get('/film/:id', function(req, res){

  const requestOne = axios.get('http://localhost:4445/api/movies/' + req.params.id + '?token=' + req.cookies.token);
  const requestTwo = axios.get('http://localhost:4445/api/logs/movie/' + req.params.id + '?token=' + req.cookies.token);

  axios.all([requestOne, requestTwo])
       .then(axios.spread((...responses) => {
          const responseOne = responses[0]

          var info = responseOne.data.dados
          var l = responseOne.data.level
          var u = responseOne.data.username

          const responseTwo = responses[1]
          var logs = responseTwo.data.dados

          count = 0
          sum = 0

          if(logs.length > 0){
            logs.forEach(l => {
              sum += l.rating
              count += 1
            });
            av = sum/count
          }
          else{av=0}
          res.render('film', {film: info, level: l, username: u, logs: logs, average: av})
        }))
        .catch(e => {res.render('error', {error: e})})
})

router.get('/admin', function(req, res) {
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
      .then(u => {
        
        if(u.data.level == 'admin'){
          res.render('admin-area')
        }
        else{
          res.render('error', {error: 'Access denied!'})
        }
      })
      .catch(e => res.render('error', {error: e}))
});

router.get('/admin/users', function(req, res) {
  axios.get('http://localhost:4445/api/users?token=' + req.cookies.token)
      .then(d => {

        if(d.data.level == 'admin'){
          var l = d.data.level
          var u = d.data.username
          var users = d.data.users
          downloads = 0
          count = 0
          users.forEach(u => {
            downloads += u.dlCounter
            count += 1
          });
          av = downloads/count
          res.render('users', {users: users, level: l, username: u, downloads: downloads, average: av})
        }
        else{
          res.render('error', {error: 'Access denied!'})
        }
      })
      .catch(e => res.render('error', {error: e}))
});

router.get('/admin/log', function(req, res) {
  axios.get('http://localhost:4445/api/logs?token=' + req.cookies.token)
      .then(d => {

        if(d.data.level == 'admin'){
          var l = d.data.level
          var u = d.data.username
          var logs = d.data.dados

          console.log(d.data)
          res.render('logs', {logs: logs, level: l, username: u})
        }
        else{
          res.render('error', {error: 'Access denied!'})
        }

      })
      .catch(e => res.render('error', {error: e}))
});

router.get('/admin/news', function(req, res) {
  axios.get('http://localhost:4445/api/news?token=' + req.cookies.token)
      .then(d => {

        if(d.data.level == 'admin'){
          var l = d.data.level
          var u = d.data.username
          var news = d.data.dados

          console.log(d.data)
          res.render('news', {news: news, level: l, username: u})
        }
        else{
          res.render('error', {error: 'Access denied!'})
        }
      })
      .catch(e => res.render('error', {error: e}))
});

router.post('/news', function(req, res){

  d = new Date()
  d = d.toISOString().split('.')[0]
  list = d.split('T')

  req.body["date"] = list[0] + " | " + list[1]
  console.log(req.body)
  axios.post('http://localhost:4445/api/news?token=' + req.cookies.token,req.body)   
    .then(dados => {res.render('success', {username: req.body.user, message: "News successfully saved!", ref: '/admin/news'})})
    .catch(e => {
      if(e.response.data.message){
        res.render('news-form', {message: e.response.data.message});
      }
      else{
        res.render('error', {error: e})
      }
    })
})

router.get('/news', function(req, res) {
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
      .then(u => {
        if(u.data.level == 'admin'){
          res.render('news-form', {level: u.data.level})
        }
        else{
          res.render('error', {error: 'Access denied!'})
        }
      })
      .catch(e => res.render('error', {error: e}))

});

router.get('/news/edit/:id', function(req, res){
  axios.get('http://localhost:4445/api/news/' + req.params.id + '?token=' + req.cookies.token)
       .then(news => {
          info = news.data.dados
          res.render('edit-news', {info: info, id: req.params.id})
        })
    .catch(e => {res.render('error', {error: e})})
})

router.post('/news/edit/:id', function(req, res){

  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {
        
          id=req.params.id
          d = new Date()
          d = d.toISOString().split('.')[0]
          list = d.split('T')

          req.body["date"] = list[0] + " | " + list[1]
          req.body["_id"] = id
          
          axios.post('http://localhost:4445/api/news/edit?token=' + req.cookies.token,req.body)   
            .then(dados => {res.render("success", {message: "News successfully saved!", ref: "/admin/news", username: u.data.username})})
            .catch(e => {res.render('error', {error: e})})

  })
  .catch(e => {res.render('error', {error: e})})
})

router.get('/news/delete/:id', function(req, res){

  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {

        axios.delete('http://localhost:4445/api/news/'+ req.params.id +'?token=' + req.cookies.token)
        .then(dados =>{res.render("success", {message: "News successfully deleted!", ref: "/admin/news", username: u.data.username})})
        .catch(e => res.render('error', {error:e,access:req.cookies.access}))

  })
  .catch(e => {res.render('error', {error: e})})

})

router.post('/search', function(req, res) {
    axios.get('http://localhost:4445/api/movies/search/' + req.body.exp + '?token=' + req.cookies.token)
      .then(d => {
        var list = d.data.dados
        var l = d.data.level
        var u = d.data.username
        res.render('films', {films: list, level: l, username: u})
      })
      .catch(e => res.render('error', {error: e}))
});

//......................................................................

router.get('/signup', function(req, res) {
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
      .then(u => {
        res.render('signup-form', {level: u.data.level})
      })
      .catch(e => res.render('error', {error: e}))

});



router.post('/signup', function(req, res) {
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {
          userLvl = u.data.level
          username = u.data.username
          axios.post('http://localhost:4444/users/signup', req.body)
            .then(dados => {
              if(userLvl=='admin'){
                res.render("success", {message: "User successfully saved!", ref: "/admin/users", username: username})
              }
              else{
                res.render("welcome")
              }
            })
            .catch(e => {
              console.log(e)
              if(e.response.data.message){
                res.render('signup-form', {message: e.response.data.message, level: userLvl});
              }
              else{
                res.render('error', {error: e})
              }
            }) 
        })
        .catch(e => {res.render('error', {error: e})})
});

router.get('/login', function(req, res) {
  res.render('login-form');
});

router.post('/login', function(req, res) {
  console.log("login: body")
  console.log(req.body)
  axios.post('http://localhost:4444/users/login?token=' + req.cookies.token, req.body)   
    .then(dados => {
      res.cookie('token', dados.data.token, {
        expires: new Date(Date.now() + '1d'),
        secure: false, // set to true if your using https
        httpOnly: true
      })
      res.redirect('/')
    })
    .catch(e => {
      console.log(e.response)
      if(e.response.status == 401 || e.response.status == 400){
        res.render('login-form', {message: "Wrong credentials!"})
      }
      else{
        res.render('error', {error: e})
      }
    })
});

router.post('/log', function(req, res){

  d = new Date()
  d = d.toISOString().split('.')[0]
  list = d.split('T')

  req.body["date"] = list[0] + " | " + list[1]
  console.log(req.body)
  axios.post('http://localhost:4445/api/logs?token=' + req.cookies.token,req.body)   
    .then(dados => {res.render('success', {username: req.body.user, message: "Log successfully saved!", ref: '/films'})})
    .catch(e => {res.render('error', {error: e})})
})

router.get('/log/edit/:id', function(req, res){
  axios.get('http://localhost:4445/api/logs/' + req.params.id + '?token=' + req.cookies.token)
       .then(log => {
          ra = log.data.dados.rating
          re = log.data.dados.review
          li = log.data.dados.like
          res.render('edit-log', {rating: ra, review: re, like: li, id: req.params.id})
        })
    .catch(e => {res.render('error', {error: e})})
})

router.post('/log/edit/:id', function(req, res){
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {

          id=req.params.id
          d = new Date()
          d = d.toISOString().split('.')[0]
          list = d.split('T')

          if(!req.body.like){
            req.body.like='false'
          }

          req.body["date"] = list[0] + " | " + list[1]
          req.body["_id"] = id
          
          console.log(req.body)
          axios.post('http://localhost:4445/api/logs/edit?token=' + req.cookies.token,req.body)   
            .then(dados => {res.render("success", {message: "Log successfully saved!", ref: "/profile", username: u.data.username})})
            .catch(e => {res.render('error', {error: e})})

  })
  .catch(e => {res.render('error', {error: e})})
})

router.get('/log/delete/:id', function(req, res){

  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {

        axios.delete('http://localhost:4445/api/logs/'+ req.params.id +'?token=' + req.cookies.token)
        .then(dados => res.render("success", {message: "Log successfully deleted!", ref: "/profile", username: u.data.username}))
        .catch(e => res.render('error', {error:e,access:req.cookies.access}))

  })
  .catch(e => {res.render('error', {error: e})})

})

router.get('/profile', function(req, res) {
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {
          user = u.data.username
          const requestOne = axios.get('http://localhost:4445/api/user/' + user + '?token=' + req.cookies.token);
          const requestTwo = axios.get('http://localhost:4445/api/logs/user/' + user + '?token=' + req.cookies.token);
          axios.all([requestOne, requestTwo])
               .then(axios.spread((...responses) => {
                  const responseOne = responses[0]
                  const responseTwo = responses[1]

                  var user = responseOne.data.dados
                  console.log(user)
                  var l = user.level
                  var u = user.username
                  var d = user.description
                  var n = user.fullname

                  var logs = responseTwo.data.dados

                  console.log(logs)
                  
                  res.render('profile', {user: user, level: l, username: u, logs: logs, description: d, fullname: n})

                }))
                .catch(e => {res.render('error', {error: e})})   
        })
    .catch(e => {res.render('error', {error: e})})

});

router.get('/profile/edit', function(req, res) {
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {
          axios.get('http://localhost:4445/api/user/' + u.data.username + '?token=' + req.cookies.token)
              .then(user => {
                f = user.data.dados.fullname
                b = user.data.dados.description
                res.render('edit-profile', {fullName: f, bio: b})
              })
              .catch(e => {res.render('error', {error: e})})
        })
    .catch(e => {res.render('error', {error: e})})

});

router.get('/user/delete/:id', function(req, res) {

  axios.get('http://localhost:4445/api/user?token=' + req.cookies.token)
       .then(u => {
          console.log(u.data)
          console.log(req.params.id)
        
          axios.delete('http://localhost:4445/api/user/'+ req.params.id +'?token=' + req.cookies.token)
                .then(dados => res.render("success", {message: "User " + req.params.id +  " successfully deleted!", ref: "/admin/users", username: u.data.username}))
                .catch(e => res.render('error', {error:e,access:req.cookies.access}))

  })
  .catch(e => {res.render('error', {error: e})})

});

router.get('/user/edit/:id', function(req, res) {

  axios.get('http://localhost:4445/api/user/' + req.params.id + '?token=' + req.cookies.token)
        .then(user => {
            aux = user.data.dados
            f = aux.fullname
            b = aux.description
            l = aux.level
            u = aux.username
            res.render('edit-user', {fullName: f, bio: b, level: l, username: u})
        })
        .catch(e => {res.render('error', {error: e})})

});

router.post('/user/edit/:id', function(req, res) {

  fname = req.body.fullname
  des = req.body.editdesc
  level = req.body.level

  axios.get('http://localhost:4445/api/user/' + req.params.id + '?token=' + req.cookies.token)
     .then(u => {

        user = u.data.dados
        
        if (fname){user.fullname = fname}
        else{user.fullname = null}

        if (des){user.description = des}
        else{user.description = null}

        user.level = level

        console.log(user)

        axios.post('http://localhost:4445/api/user/edit/' + user.username + '?token=' + req.cookies.token, user)
            .then(u => {res.redirect('/admin/users')})
            .catch(e => {res.render('error', {error: e})})
  
      })


  .catch(e => {res.render('error', {error: e})})
})

//upload da pfp
//falta verificar permissoes
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname)
}
})


var upload = multer({ storage: storage })

router.post('/profile/edit', upload.single('imageupload'), function(req, res) {
    fname = req.body.fullname
    des = req.body.editdesc
    parentDir = path.normalize(__dirname+"/.."); 

    axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
       .then(u => {

          let user = u.data 

          if(req.file){
            let oldPath = parentDir + '/' + req.file.path
            let newPath = parentDir + '/static/' + user.username + ".jpeg"
            fs.renameSync(oldPath, newPath)
          }
          
          if (fname){user.fullname = fname}
          else{user.fullname = null}

          if (des){user.description = des}
          else{user.description = null}

          axios.post('http://localhost:4445/api/user/edit/' + user.username + '?token=' + req.cookies.token, user)
              .then(u => {res.redirect('/profile')})
              .catch(e => {res.render('error', {error: e})})
    
        })
    .catch(e => {res.render('error', {error: e})})
})

// serving the profile images
router.get('/user/profile_picture/:username', function(req,res) {
    username = req.params.username
    p = path.join(__dirname, "../static/"+username+".jpeg")
    console.log("file path")
    console.log(p)
    try {
        if (fs.existsSync(p)){
            res.sendFile(p)
        }else{
            res.sendFile(path.join(__dirname, "../public/images/user.jpeg"))
        }
    }catch{
        console.error(err)
    }

})

router.get('/logout', function(req, res) {
  res.clearCookie('token');
  res.redirect('/films');
});

router.get('/download', function(req, res) {
  console.log(req.body)
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
    .then(u => {
      //esta logged in 
      let user = u.data.username
      axios.get('http://localhost:4445/api/logs/user/' + user + '?token=' + req.cookies.token)
      .then( data => {
          logs = data.data.dados
          let csv = ''
          let separator = "&"
          logs.forEach(log => {
            //criar o ficheiro dos logs
            csv += log.user + separator
            csv += log.idMovie + separator
            csv += log.movie + separator
            csv += log.rating + separator
            csv += log.review + separator
            csv += (log.like ? true : false )+ separator
            csv += log.date + "\n"
          });
          axios.get('http://localhost:4445/api/incDl/' + user + '?token=' + req.cookies.token).then( u=> {
            res.set({"Content-Disposition":`attachment; filename=\"${logs.user}.csv\"`});
            res.send(csv);
          })
      })
    })
    .catch(e => {
      console.log(e.response)
      res.render('error', {error: e})
    })
});

router.get('/import', upload.single('csvupload'), function(req, res) {
  res.render('submit-logs')
})

const uploadcsv = multer({ dest: 'tmp/csv/' });
//router.get('/import', upload.single('file'), function(req, res) {
router.post('/import', uploadcsv.single('csvupload') ,function(req, res) {
  console.log(req.body)
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
    .then(u => {
      d = new Date()
      d = d.toISOString().split('.')[0]
      list = d.split('T')

      let date = list[0] + " | " + list[1]
     //esta logged in 
      let user = u.data.username
      let separator = "&"

      //test string, should be reading from file that user sends

      requests = []
      if(req.file){
        csv.parseFile(req.file.path,{ ignoreEmpty: true, delimiter: separator })
        .on('error', error => console.error(error))
        .on('data', row => {
          body = {user: user, idMovie: row[1], movie: row[2],rating: row[3],review: row[4],like: row[5],date: date }
          requests.push(axios.post('http://localhost:4445/api/logs?token=' + req.cookies.token, body)) 
          console.log(row)
        })
        .on('end', rowCount => {
          axios.all(requests)
            .then(axios.spread((...responses) => {
              //nao sei como dar handle aos requests todos
              res.redirect('/profile')
            }))
            .catch( e => {res.render('error', {error: e})})
          });
      }
      else{
        res.render('edit-profile', {fullName: user.fullname, bio: user.bio, message: "Select a file!"})
      }
      
    })
    .catch(e => {
      console.log(e.response)
      res.render('error', {error: e})
    })
});


var bagsrc = path.join(__dirname, '..')
var bagoutputDir = path.join(__dirname, "../tmp/bag")
var bag = BagIt(bagoutputDir, {'Contact-Name': 'PP&sof?'})

router.get('/createbag', function ( req,res) {
  axios.get('http://localhost:4445/api/user/?token=' + req.cookies.token)
      .then(u => {
        
        if(u.data.level == 'admin'){
        //ver todos os users, e copiar os dados + foto
        console.log('starting Bag')
          bag.mkdir('/users', function () {
            axios.get('http://localhost:4445/api/users' + '?token=' + req.cookies.token).then(users =>{
              if (!fs.existsSync(path.join(__dirname, "../tmp/users/"))){
                fs.mkdirSync(path.join(__dirname, "../tmp/users/"));
              }
              //console.log(u)
              users.data.dados.forEach(user => {
                  json = JSON.stringify(user)
                  fs.writeFile(path.join(__dirname, "../tmp/"+user.username),json,'utf8',function () {
                    fs.createReadStream(path.join(__dirname, "../tmp/"+user.username)).pipe(bag.createWriteStream('users/'+user.username))

                    p = path.join(__dirname, "../static/"+user.username+".jpeg")
                    try {
                      if (fs.existsSync(p)){
                        fs.createReadStream(p).pipe(bag.createWriteStream('users/'+user.username + '.jpeg'))
                          res.sendFile(p)
                      }
                    }catch{
                      console.error(err)
                    }
                })
              });
            }).catch(e =>{
              console.log(e.response)
              //res.render('error',{error:e})
            })
          
            //ver todos os filmes e copiar as reviews
            bag.mkdir('/logs', function () {
              console.log("comecei os logs")
              axios.get('http://localhost:4445/api/movies' + '?token=' + req.cookies.token).then(m =>{
                //console.log(u)
                movies = m.data.dados
                    axios.get('http://localhost:4445/api/logs' + '?token=' + req.cookies.token).then(u =>{
                      logs = u.data.dados
                      if (!fs.existsSync(path.join(__dirname, "../tmp/logs/"))){
                        fs.mkdirSync(path.join(__dirname, "../tmp/logs/"));
                      }
                      movies.forEach(movie => {
                        //get the logs from that movie
                        //console.log(movie._id)
                        let filtrado = logs.filter(x => {console.log(parseInt(x.idMovie) == movie._id); return parseInt(x.idMovie) == movie._id})
                        if (filtrado.length>0 ){
                          json = JSON.stringify(filtrado)
                          
                          fs.writeFile(path.join(__dirname, "../tmp/logs/"+movie._id),json,'utf8',function () {
                            fs.createReadStream(path.join(__dirname, "../tmp/logs/"+movie._id)).pipe(bag.createWriteStream('logs/'+movie._id))
                          })
                          
                        };
                      })
                    bag.finalize(function () {console.log("ended bag")})
                    //zip o bag
                    zip(bagoutputDir, path.join(__dirname, "../tmp/bag.zip")).then( function () {
                      console.log("bag created")
                      var file = fs.readFileSync(path.join(__dirname, "../tmp/bag.zip"), 'binary')
                      res.set({"Content-Disposition":`attachment; filename=\"/bag.zip.csv\"`});
                      res.send(file);
                      res.redirect("/")
                    });
                  })
                });
              })
          })
        }
        else{
          res.render('error', {error: 'Access denied!'})
        }
      })
      .catch(e => res.render('error', {error: e}))

  }) 

module.exports = router;