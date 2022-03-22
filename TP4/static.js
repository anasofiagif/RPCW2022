var fs = require('fs')

// testa se o recurso é estático
function recursoEstatico(request){
    return /\/w3.css$/.test(request.url)
}

exports.recursoEstatico = recursoEstatico

// serve os recursos estáticos
function sirvoRecursoEstatico(req, res){
    var partes = req.url.split('/')
    var file = partes[partes.length -1 ]
    fs.readFile('resources/' + file, (erro, dados)=>{
        if(erro){
            console.log('Erro: ficheiro não encontrado ' + erro)
            res.statusCode = 404
            res.end()
        }
        else{
            // se for um favicon, o header é alterado antes dos dados serem enviados
            if(file == 'favicon.ico')
                res.setHeader('Content-Type', 'image/x-icon')
            res.end(dados)
        }
    })
}

exports.sirvoRecursoEstatico = sirvoRecursoEstatico