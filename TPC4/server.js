var http = require('http')
var axios = require('axios')
var templates = require('./templates')
var static = require('./static.js')
const { parse } = require('querystring');
const { copyFile } = require('fs');

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var alunosServer = http.createServer(function (req, res) {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                // GET /compositores --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/compositores")){
                    axios.get("http://localhost:3000/compositores?_sort=nome")
                        .then(response => {
                            let clist = response.data
                            res.write(templates.compositoresListPage(clist,d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de compositores... Erro: " + erro)
                            res.end()
                        })
                }
                // GET /compositores/:id --------------------------------------------------------------------
                else if(/\/compositores\/(C)[0-9]+$/i.test(req.url)){
                    var idComp = req.url.split("/")[2]
                    axios.get("http://localhost:3000/compositores/" + idComp)
                        .then( response => {
                            let c = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.compositorPage(c,d))
                            res.end()
                        })
                }
                // GET /compositores/registo --------------------------------------------------------------------
                else if(req.url == "/compositores/registo"){
                    let periodoList = []
                    axios.get('http://localhost:3000/periodos')
                        .then(resp => {
                            lista = resp.data
                            lista.forEach(periodo =>{
                                periodoList.push({'id' : periodo.id ,'nome': periodo.nome})
                            })
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.compositorFormPage(d,periodoList))
                            res.end()
                    }).catch(erro => {console.log('erro ')+erro})
                }
                // GET /compositores/edit/:id --------------------------------------------------------------------
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    var idComp = req.url.split("/")[3]
                    var periodoList = []
                    axios.get('http://localhost:3000/periodos')
                        .then(info => {
                            lista = info.data
                            lista.forEach(periodo =>{
                                periodoList.push({'id' : periodo.id ,'nome': periodo.nome})
                            })
                        }).catch(erro => {console.log('erro ')+erro})
                    axios.get("http://localhost:3000/compositores/" + idComp)
                        .then(function(resp){
                            var compositor = resp.data
                            res.write(templates.compositorFormEditPage(compositor, d,periodoList))
                            res.end()
                        }).catch(erro => {
                            console.log("Erro: " + erro)
                            res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.errorPage("Unable to collect record: " + idComp, d))
                            res.end()
                        })
                }
                // GET /compositores/delete/:id --------------------------------------------------------------------
                else if(/\/compositores\/delete\/(C)[0-9]+$/i.test(req.url)){
                    var idComp = req.url.split("/")[3]
                    axios.delete('http://localhost:3000/compositores/' + idComp)
                        .then(resp => {
                            periodoId = resp.data.periodo.id
                            compositorId = resp.data.id
                            if (periodoId){
                                axios.get('http://localhost:3000/periodos/' + periodoId)
                                    .then(resp =>{
                                        info = resp.data
                                        info.compositores = info.compositores.filter(item => item.id !== compositorId)
                                        axios.put('http://localhost:3000/periodos/' + periodoId,info)
                                        .then().catch(() => console.error('Erro sub'))
                                    })
                            }
                            console.log("Delete " + idComp + " :: " + resp.status);
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Registo apagado:' + idComp  + '</p>')
                            res.write('<p><a href="/compositores">Voltar</a></p>')
                            res.end()
                        }).catch(error => {
                            console.log('Erro: ' + error);
                            res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.errorPage("Unable to delete record: " + idComp, d))
                            res.write('<p><a href="/periodos">Voltar</a></p>')
                            res.end()
                        })
                }
                else if (req.url == "/periodos"){
                    axios.get('http://localhost:3000/periodos')
                        .then( resp =>{
                            let plist = resp.data
                            res.write(templates.periodoListPage(plist,d))
                            res.end()
                        })
                }
                else if(/\/periodos\/(P)[0-9]+$/i.test(req.url)){
                    var periodoId = req.url.split('/')[2]
                    axios.get('http://localhost:3000/periodos/' + periodoId)
                        .then(resp =>{
                            p = resp.data
                            res.write(templates.periodoPage(p,d))
                            res.end()
                        }).catch(err => console.log('Erro: ' + err))
                }
                else if (req.url == '/periodos/registo'){
                    res.write(templates.periodoFormPage(d))
                    res.end()
                }
                else if (/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)){
                    var periodoId = req.url.split('/')[3]
                    axios.delete('http://localhost:3000/periodos/'+periodoId)
                        .then(resp =>{
                            p = resp.data
                            res.write(templates.periodoFormEditPage(p,d))
                            res.end()
                        }).catch(err =>{console.log('Erro: ' + err)})
                }
                else if (/\/periodos\/delete\/(P)[0-9]+$/i.test(req.url)){
                    var periodoId = req.url.split('/')[3]
                    axios.delete('http://localhost:3000/periodos/'+periodoId)
                        .then(resp =>{
                            console.log("Delete " + idComp + " :: " + resp.status);
                            res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Registo apagado:' + idComp  + '</p>')
                            res.write('<p><a href="/compositores">Voltar</a></p>')
                            res.end()
                        }).catch(error => {
                            console.log('Erro: ' + error);
                            res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.errorPage("Unable to delete record: " + idComp, d))
                            res.write('<p><a href="/compositores">Voltar</a></p>')
                            res.end()
                        })
                    axios.get('http://localhost:3000/compositores')
                    .then(resp =>{
                        compList = resp.data
                        compList.forEach(comp =>{
                            if (comp.periodo.id === periodoId){
                                comp.periodo = {}
                                axios.put('http://localhost:3000/compositores/'+comp.id,comp)
                                    .then().catch(()=>console.log('Erro delete periodo comp'))
                            }
                        })
                    }).catch(()=>console.log('Erro periodo delete get comp'))
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " unsupported on this server.</p>")
                    res.write('<p><a href="/">Return</a></p>')
                    res.end()
                }
                break
            case "POST":
                if(req.url == '/compositores/registo'){
                    var periodoList = []
                    axios.get('http://localhost:3000/periodos')
                        .then(info => {
                            lista = info.data
                            lista.forEach(periodo =>{
                                periodoList.push({'id' : periodo.id ,'name': periodo.nome})
                            })
                            collectRequestBodyData(req, result => {
                                flag = false
                                periodoList.forEach(p =>{
                                    if (p.name === result.periodo){
                                        result.periodo = {'id': p.id,'name' : p.name}
                                        flag = true
                                        result.periodo = p
                                        axios.get('http://localhost:3000/periodos/' + p.id)
                                            .then(resp =>{
                                                info = resp.data
                                                info.compositores.push({'id' : result.id, 'nome': result.nome})
                                                axios.put('http://localhost:3000/periodos/' + p.id,info)
                                                .then().catch(() => console.error('Erro ad'))
                                            }).catch(err =>{console.log('Erro: ' + err);})
                                    }
                                })
                                if (!flag){
                                    result.periodo = {'id' : `P${periodoList.length+1}`,'name' : result.periodo}
                                    newEntry = {'id' : result.periodo.id, 'nome' : result.periodo.name, 'compositores' : [{'id' : result.id, 'nome' : result.nome}]}
                                    axios.post('http://localhost:3000/periodos',newEntry)
                                        .then( resp =>{
                                            //console.log(resp.data)
                                        }).catch(err =>{
                                            console.log('Erro ' + err)
                                        })
                                }
                                if(result){
        
                                    axios.post('http://localhost:3000/compositores', result)
                                        .then(resp => {
                                            //console.log(resp.data);
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write('<p>Registo criado:' + JSON.stringify(resp.data)  + '</p>')
                                            res.write('<p><a href="/compositores">Voltar</a></p>')
                                            res.end()
                                        })
                                        .catch(error => {
                                            console.log('Erro: ' + error);
                                            res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write('<p><a href="/compositores">Voltar</a></p>')
                                            res.write(templates.errorPage("Unable to insert record...", d))
                                            res.end()
                                        });
                            }
                            else{
                                res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Unable to collect data from body...</p>")
                                res.write('<p><a href="/compositores">Voltar</a></p>')
                                res.end()
                            }
                        });
                        }).catch(erro => {console.log('erro ')+erro})
                }
                else if(/\/compositores\/edit\/(C)[0-9]+$/i.test(req.url)){
                    var periodoList = []
                    axios.get('http://localhost:3000/periodos')
                        .then(info => {
                            lista = info.data
                            lista.forEach(periodo =>{
                                periodoList.push({'id' : periodo.id ,'name': periodo.nome})
                            })
                            collectRequestBodyData(req, result => {
                                flag = false
                                periodoList.forEach(p =>{
                                    if (p.name === result.periodo){
                                        result.periodo = {'id': p.id,'name' : p.name}
                                        flag = true
                                        axios.get('http://localhost:3000/compositores/' + result.id)
                                        .then(resp =>{
                                            let idToChange = resp.data.periodo.id
                                            result.periodo = p
                                            axios.get('http://localhost:3000/periodos/' + p.id)
                                            .then(resp =>{
                                                info = resp.data
                                                info.compositores.push({'id' : result.id, 'nome': result.nome})
                                                axios.put('http://localhost:3000/periodos/' + p.id,info)
                                                .then().catch(() => console.error('Erro ad'))
                                            }).catch(err =>{console.log('Erro: ' + err);})
                                            axios.get('http://localhost:3000/periodos/' + idToChange)
                                            .then(resp =>{
                                                info = resp.data
                                                info.compositores = info.compositores.filter(item => item.id !== result.id)
                                                axios.put('http://localhost:3000/periodos/' + idToChange,info)
                                                .then().catch(() => console.error('Erro sub'))
                                            }).catch(err =>{console.log('Erro: ' + err);})
                                        }).catch(err => console.log('Erro ' + err))
                                    }
                                })
                                if (!flag){
                                    result.periodo = {'id' : `P${periodoList.length+1}`,'name' : result.periodo}
                                    newEntry = {'id' : result.periodo.id, 'nome' : result.periodo.name, 'compositores' : [{'id' : result.id, 'nome' : result.nome}]}
                                    axios.post('http://localhost:3000/periodos',newEntry)
                                        .then( resp =>{
                                            //console.log(resp.data)
                                        }).catch(err =>{
                                            console.log('Erro ' + err)
                                        })
                                    axios.get('http://localhost:3000/compositores/' + result.id)
                                    .then(resp =>{
                                        let idToChange = resp.data.periodo.id
                                        axios.get('http://localhost:3000/periodos/' + idToChange)
                                            .then(resp =>{
                                                info = resp.data
                                                info.compositores = info.compositores.filter(item => item.id !== result.id)
                                                axios.put('http://localhost:3000/periodos/' + idToChange,info)
                                                .then().catch(() => console.error('Erro sub'))
                                            }).catch(err =>{console.log('Erro: ' + err);})

                                    })
                                }
                                if(result){
        
                                    axios.put('http://localhost:3000/compositores/' + result.id, result)
                                        .then(resp => {
                                            //console.log(resp.data);
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write('<p>Registo alterado:' + JSON.stringify(resp.data)  + '</p>')
                                            res.write('<p><a href="/compositores">Voltar</a></p>')
                                            res.end()
                                        })
                                        .catch(error => {
                                            console.log('Erro: ' + error);
                                            res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write('<p><a href="/compositores">Voltar</a></p>')
                                            res.write(templates.errorPage("Unable to insert record...", d))
                                            res.end()
                                        });
                            }
                            else{
                                res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Unable to collect data from body...</p>")
                                res.write('<p><a href="/compositores">Voltar</a></p>')
                                res.end()
                            }
                        });
                        }).catch(erro => {console.log('erro ') + erro})
                }
                else if (req.url == '/periodos/registo'){
                    collectRequestBodyData(req,  result =>{
                        newPeriodo = {'id' : result.id, 'nome' : result.nome, 'compositores' : []}
                        if (result){
                            axios.post('http://localhost:3000/periodos',newPeriodo)
                                .then(resp =>{
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p>Registo criado:' + JSON.stringify(resp.data)  + '</p>')
                                    res.write('<p><a href="/periodos">Voltar</a></p>')
                                    res.end()
                                }).catch(err =>{
                                    console.log('Erro: ' + error);
                                    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p><a href="/periodos">Voltar</a></p>')
                                    res.write(templates.errorPage("Unable to insert record...", d))
                                    res.end()
                                })
                        } else {
                        res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Unable to collect data from body...</p>")
                        res.write('<p><a href="/periodos">Voltar</a></p>')
                        res.end()
                        }
                    })
                }
                else if (/\/periodos\/edit\/(P)[0-9]+$/i.test(req.url)){
                    var periodoId = req.url.split('/')[3]
                    axios.get('http://localhost:3000/periodos/' + periodoId)
                        .then( resp => {
                        collectRequestBodyData(req, result =>{
                            if(result){
                                var newName = result.nome
                                // alterar nome em /compositores
                                axios.get('http://localhost:3000/compositores')
                                    .then(ans =>{
                                        compList = ans.data
                                        compList.forEach(comp =>{
                                            if (comp.periodo.id === periodoId){
                                                comp.periodo.name = newName
                                                axios.put('http://localhost:3000/compositores/'+comp.id,comp)
                                                .then().catch(()=> console.log('erro alterado Nome do período em compositores'))
                                            }
                                        })
                                    }).catch(()=> console.log('erro get comp post edit periodos'))
                                //alterar Nome em /periodos
                                info = resp.data
                                info.nome = newName
                                axios.put('http://localhost:3000/periodos/' + periodoId,info)
                                .then(resp =>{
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p>Registo alterado:' + JSON.stringify(resp.data)  + '</p>')
                                    res.write('<p><a href="/periodos">Voltar</a></p>')
                                    res.end()
                                }).catch(error =>{
                                    console.log('erro Result')
                                    console.log('Erro: ' + error);
                                    res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p><a href="/periodos">Voltar</a></p>')
                                    res.write(templates.errorPage("Unable to insert record...", d))
                                    res.end()
                                })
                            } else {
                                res.writeHead(201, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Unable to collect data from body...</p>")
                                res.write('<p><a href="/compositores">Voltar</a></p>')
                                res.end()
                            }
                        })
                    }).catch('erro get período post edit')
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Unsupported POST request: ' + req.url + '</p>')
                    res.write('<p><a href="/">Return</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " unsupported in this server.</p>")
                res.end()
        }
    }
    
})

alunosServer.listen(8676, ()=>{
    console.log("Servidor à escuta na porta 8676...")
})
