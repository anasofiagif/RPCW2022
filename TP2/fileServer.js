var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    var myurl = req.url.substring(1)

    console.log(myurl)

    fs.readFile('./out/' + myurl + '.html', function(err, data){

        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

        if(err){
            res.write("<p>Erro na leitura do ficheiro...</p>")
        }
        else{
            res.write(data)
        }
        res.end()
    })

}).listen(1441)

console.log("Server listening on port 1441...")

