var http = require('http')
var fs = require('fs')
var url = require('url')
var axios = require('axios')

function writeMovie(movie){
    str =`
    <h1> Movie: ${movie.title} </h1>
    <h3> Release year: ${movie.year} </h3>
    <p> Cast </p>
    <ul>
    `
    movie.cast.forEach((actor) =>{
        str += `<li><a href="http://localhost:9241/actors/${actor.id}"> ${actor.actor}</a></li>`
    })
    str += `</ul>
    Genres
    <ul>`
    movie.genres.forEach((genre) =>{
        str += `<li><a href="http://localhost:9241/genres/${genre.id}"> ${genre.genre}</a></li>`
    })
    str += '</ul>'
    str += '<p> <a href="http://localhost:9241/"> Main Page </a></p>'
    return str
}

function writeActor(actor){
    str =`
    <h1> Name: ${actor.name} </h1>
    <p> Movies </p>
    `
    if (actor.hasOwnProperty('movies')){
        str += '<ul>'
        actor.movies.forEach((movie) =>{
            str += `<li><a href="http://localhost:9241/movies/${movie.id}"> ${movie.title}</a></li>`
        })
        str += '</ul>'
    }
    str += '<p> <a href="http://localhost:9241/"> Main Page </a></p>'
    return str
}

function writeGenre(genre){
    str = `
    <h1> Genre: ${genre.name} </h1>
    <ul>
    `
    genre.movies.forEach((movie) =>{
        str += `<li><a href="http://localhost:9241/movies/${movie.id}"> ${movie.title}</a></li>`
    })
    str += "</ul>"
    str += '<p> <a href="http://localhost:9241/"> Main Page </a></p>'
    return str
}

http.createServer( (req,res) =>{
    console.log(`${req.method} ${req.url}`)
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'});

    var q = url.parse(req.url,true)
    if (q.pathname == '/'){
        res.write('<ul>');
        res.write('<li><a href="http://localhost:9241/actors"> Actors </a></li>')
        res.write('<li><a href="http://localhost:9241/genres"> Genres </a></li>')
        res.write('<li><a href="http://localhost:9241/movies"> Movies </a></li>')
        res.end('</ul>')
    } else if (q.pathname == '/movies'){
        axios.get('http://localhost:3000/movies')
        .then( (resp) => {
            lista = resp.data
            res.write('<ul>')
            lista.forEach( (movie) =>{
                res.write(`<li> <a href="http://localhost:9241/movies/${movie.id}"> ${movie.title} </a></li>`)
            })
            res.write('</ul>')
            res.end()
        }).catch(erro =>{
                res.end("Erro " + erro)
        })
    } else if (q.pathname.search(/\/movies\/[\d|\w]+/) != -1){
        axios.get(`http://localhost:3000${q.path}`)
        .then( (resp) => {
            movie = resp.data
            res.write(writeMovie(movie))
            res.end()
        }).catch( (erro) => {console.log(erro)})
    } else if (q.pathname == '/actors'){
        axios.get('http://localhost:3000/actors')
        .then( (resp) => {
            lista = resp.data
            res.write('<ul>')
            lista.forEach( (actor) =>{
                res.write(`<li> <a href="http://localhost:9241/actors/${actor.id}"> ${actor.name} </a></li>`)
            })
            res.write('</ul>')
            res.end()
        }).catch(erro =>{
            res.end("Erro " + erro)
        })
    } else if (q.pathname.search(/\/actors\/[\d|\w]+/) != -1){
        axios.get(`http://localhost:3000${q.path}`)
        .then( (resp) => {
            actor = resp.data
            res.write(writeActor(actor))
            res.end()
        }).catch( (erro) => {console.log(erro)})
    }else if (q.pathname == '/genres'){
        axios.get('http://localhost:3000/genres')
        .then( (resp) => {
            lista = resp.data
            res.write('<ul>')
            lista.forEach( (genre) =>{
                res.write(`<li> <a href="http://localhost:9241/genres/${genre.id}"> ${genre.name} </a></li>`)
            })
            res.write('</ul>')
            res.end()
        }).catch(erro =>{
            res.end("Erro " + erro)
        })
    } else if (q.pathname.search(/\/genres\/[\d|\w]+/) != -1){
        axios.get(`http://localhost:3000${q.path}`)
        .then( (resp) => {
            genre = resp.data
            res.write(writeGenre(genre))
            res.end()
        }).catch( (erro) => {console.log(erro)})
    }else{
        res.write('Página não Encontrada')
        res.end()
    }

}).listen(9241)

console.log('Listening on port 9241')