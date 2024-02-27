var http = require('http')
var url = require('url')
var axios = require('axios')

function writeAlunoLink(aluno){
    str = `
    <ul>
    <li> ${aluno.id}</li>
    <li> <a href="http://localhost:17001/alunos/${aluno.id}"> ${aluno.nome} </a></li>
    <li> <a href="http://localhost:17001/cursos/${aluno.curso}"> ${aluno.curso} ${aluno.anoCurso}º ano </a></li>
    <li> Instrumento: ${aluno.instrumento}
    </ul>
    `
    return str
}

function writeAluno(aluno){
    str =`
    <ul>
    <li> ${aluno.id}</li>
    <li> ${aluno.nome} </li>
    <li> <a href="http://localhost:17001/cursos/${aluno.curso}"> ${aluno.curso} ${aluno.anoCurso}º ano </a></li>
    <li> Instrumento: ${aluno.instrumento}
    </ul>
    `
    return str
}

function writeCursoLink(curso){
    str = `
    <ul>
    <li> <a href="http://localhost:17001/cursos/${curso.id}"> ${curso.designacao} </a></li>
    <li> duração: ${curso.duracao}</li>
    <li> <a href="http://localhost:17001/instrumentos/${curso.instrumento.id}"> ${curso.instrumento['#text']} </a></li>
    </ul>
    `
    return str
}

function writeCurso(curso){
    str = `
    <ul>
    <li> ${curso.designacao} </li>
    <li> duração: ${curso.duracao}</li>
    <li> <a href="http://localhost:17001/instrumentos/${curso.instrumento.id}"> ${curso.instrumento['#text']} </a></li>
    </ul>
    `
    return str
}

function writeInstrumentoLink(instrumento){
    str=`
    <ul>
    <li> <a href="http://localhost:17001/instrumentos/${instrumento.id}"> ${instrumento['#text']} </a></li>
    </ul>
    `
    return str
}

function writeInstrumento(instrumento){
    str=`
    <ul>
    <li> ${instrumento['#text']} </li>
    </ul>
    `
    return str
}

http.createServer(function(req, res) {

    var q = url.parse(req.url,true)
    
    if (q.pathname == '/alunos'){
        axios.get("http://localhost:3000/alunos")
            .then( (resp) => {
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
                lista = resp.data
                lista.forEach( a =>{
                    res.write(writeAlunoLink(a))
                })
                res.end('<p><a href="http://localhost:17001"> Voltar </a></p>')
            }).catch( erro => {
                console.log("Erro: " + erro)
            })
    } else if (q.pathname == '/'){
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
        res.write('<ul>');
        res.write('<li><a href="http://localhost:17001/alunos"> Alunos </a></li>')
        res.write('<li><a href="http://localhost:17001/cursos"> Cursos </a></li>')
        res.write('<li><a href="http://localhost:17001/instrumentos"> Instrumentos </a></li>')
        res.end('</ul>')
    } else if (q.pathname == '/instrumentos'){
        axios.get("http://localhost:3000/instrumentos")
            .then( (resp) =>{
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
                lista = resp.data
                lista.forEach( instrumento =>{
                    res.write(writeInstrumentoLink(instrumento))
                })
                res.end('<p><a href="http://localhost:17001"> Voltar </a></p>')
            }).catch( erro =>{
                console.log("Erro: " + erro);
            })
        
    } else if (q.pathname == '/cursos'){
        axios.get("http://localhost:3000/cursos")
            .then( (resp) => {
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
                lista = resp.data
                lista.forEach( curso =>{
                    res.write(writeCursoLink(curso))
                })
                res.end('<p><a href="http://localhost:17001"> Voltar </a></p>')
            }).catch( erro =>{
                console.log("Erro: " + erro)
            })
    } else if (q.pathname.search(/\/alunos\/A\d+/) != -1){
        axios.get(`http://localhost:3000${q.path}`)
            .then( (resp) => {
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
                aluno = resp.data
                res.write(writeAluno(aluno))
                res.end('<p><a href="http://localhost:17001/alunos"> Voltar </a></p>')
            }).catch( erro =>{
                console.log("Erro:" + erro)
            })
    } else if (q.pathname.search(/\/cursos\/[A-Z]{2}\d+/) != -1){
        axios.get(`http://localhost:3000${q.path}`)
            .then( (resp) =>{
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
                curso = resp.data
                res.write(writeCurso(curso))
                res.end('<p><a href="http://localhost:17001/cursos"> Voltar </a></p>')
            }).catch(erro =>{
                console.log('Erro: ' + erro);
            })
    } else if (q.pathname.search(/\/instrumentos\/I\d+/) != -1){
        axios.get(`http://localhost:3000${q.path}`)
            .then( (resp) =>{
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
                instrumento = resp.data
                res.write(writeInstrumento(instrumento))
                res.end('<p><a href="http://localhost:17001/instrumentos"> Voltar </a></p>')
            }).catch(erro =>{
                console.log('Erro: ' + erro);
            })
    }else{
        res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'})
        res.write("Operação não suportada")
        res.end('<p><a href="http://localhost:17001"> Voltar </a></p>')
    }

}).listen(17001);

console.log('Servidor à escuta na porta 17001')