var axios = require('axios')

// Student list
module.exports.compList = () => {
    return axios.get('http://localhost:3000/compositores?_sort=nome')
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getCompositor = id => {
    return axios.get('http://localhost:3000/compositores/' + id)
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}

module.exports.addCompositor = c => {
    return axios.post('http://localhost:3000/compositores',c)
            .then( resposta =>{
                return resposta.data
            })
            .catch( erro =>{
                return erro
            })
}

module.exports.updateCompositor = a => {
    return axios.put('http://localhost:3000/compositores/' + a.id, a)
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deleteCompositor = id => {
    return axios.delete('http://localhost:3000/compositores/' + id)
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}