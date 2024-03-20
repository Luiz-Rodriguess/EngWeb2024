var axios = require('axios')

// Student list
module.exports.periodoList = () => {
    return axios.get('http://localhost:3000/periodos')
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getPeriodo = id => {
    return axios.get('http://localhost:3000/periodos/' + id)
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}

module.exports.addPeriodo = p => {
    return axios.post('http://localhost:3000/periodos',p)
            .then( resp =>{
                return resp.data
            })
            .catch( erro =>{
                return erro
            })
}

module.exports.updatePeriodo = p => {
    return axios.put('http://localhost:3000/periodos/' + p.id, p)
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deletePeriodo = id => {
    return axios.delete('http://localhost:3000/periodos/' + id)
            .then(resposta => {
                return resposta.data
            })
            .catch(erro => {
                return erro
            })
}