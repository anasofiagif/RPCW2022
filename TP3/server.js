var http = require('http')
var url = require('url')
const axios = require('axios')

function navigation(page){

    if(page == "") {
        nav = "<p><a href = 'http://localhost:4000/alunos'>Alunos</a></p>\n" +        
              "<p><a href = 'http://localhost:4000/cursos'>Cursos</a></p>\n" +
              "<p><a href = 'http://localhost:4000/instrumentos'>Instrumentos</a></p>\n"
    }
    else {
        nav = "<p><a href = 'http://localhost:4000/'>Página Inicial</a></p>\n"
    }
        
    return nav
}

function generateMainPage(){
    page = "<body>\n" +
           "<h1>Página Inicial</h1>\n" +
           navigation("") +
           "</body>\n" 
    return page
}

async function generateStudentsPage(){

    page = "<style>\ntable, th, td {border:1px solid black;}\n</style>\n" +
           "<body>\n" +
           navigation("alunos") + 
           "<h1>Alunos</h1>\n" +
           "<table style='width:100%'>\n" +
           "<tr>\n" + 
           "<th>ID</th>\n" +
           "<th>Nome</th>\n" +
           "<th>Curso</th>\n" +
           "<th>Instrumento</th>\n" +
           "</tr>\n" 
    
    await axios.get('http://localhost:3000/alunos?_sort=nome&_order=asc')
                .then(function (resp) {
                    alunos = resp.data;
                    alunos.forEach(p => {
                    page += "<tr>\n" +
                            "<td>" + p.id + "</td>\n" +
                            "<td>" + p.nome + "</td>\n" +
                            "<td>" + p.curso + "</td>\n" +
                            "<td>" + p.instrumento + "</td>\n" + 
                             "</tr>\n";
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });

    page += "</table>\n" +
            "</body>\n"

    return page       
}

async function generateInstrumentsPage(){

    page = "<style>\ntable, th, td {border:1px solid black;}\n</style>\n" +
           "<body>\n" +
           navigation("alunos") + 
           "<h1>Instrumentos</h1>\n" +
           "<table style='width:100%'>\n" +
           "<tr>\n" + 
           "<th>ID</th>\n" +
           "<th>Designação</th>\n" +
           "</tr>\n" 
    
    await axios.get('http://localhost:3000/instrumentos?_sort=%23text&_order=asc')
                .then(function (resp) {
                    alunos = resp.data;
                    alunos.forEach(p => {
                    page += "<tr>\n" +
                            "<td>" + p.id + "</td>\n" +
                            "<td>" + p["#text"] + "</td>\n" +
                            "</tr>\n"; 
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });

    page += "</table>\n" +
            "</body>\n"

    return page       
}

async function generateCoursesPage(){

    page = "<style>\ntable, th, td {border:1px solid black;}\n</style>\n" +
           "<body>\n" +
           navigation("alunos") + 
           "<h1>Cursos</h1>\n" +
           "<table style='width:100%'>\n" +
           "<tr>\n" + 
           "<th>ID</th>\n" +
           "<th>Designação</th>\n" +
           "<th>Duração</th>\n" +
           "</tr>\n" 
    
    await axios.get('http://localhost:3000/cursos?_sort=designacao&_order=asc')
                .then(function (resp) {
                    alunos = resp.data;
                    alunos.forEach(p => {
                    page += "<tr>\n" +
                            "<td>" + p.id + "</td>\n" +
                            "<td>" + p.designacao + "</td>\n" +
                            "<td>" + p.duracao + "</td>\n" +
                            "</tr>\n"; 
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });

    page += "</table>\n" +
            "</body>\n"

    return page       
}


myserver = http.createServer(function (req, res) {

    var d = new Date().toISOString().substring(0,16)
    console.log(req.method + " " + req.url + " " + d)
    var myurl = url.parse(req.url, true).pathname

    // main page
    if(myurl == "/") {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write(generateMainPage())
        res.end()
    }
    // students' page
    else if(myurl == "/alunos"){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateStudentsPage().then(p => {
            res.write(p)
            res.end()
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    // instruments' page
    else if(myurl == "/instrumentos"){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateInstrumentsPage().then(p => {
            res.write(p)
            res.end()
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    // courses' page
    else if(myurl == "/cursos"){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        generateCoursesPage().then(p => {
            res.write(p)
            res.end()
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end("<b>Rota não suportada:" + req.url + "</b>")
    }

})

myserver.listen(4000)
console.log('Servidor à escuta na porta 4000...')