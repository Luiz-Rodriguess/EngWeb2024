var Periodo = require('../models/periodos')

// Periodo list
module.exports.periodoList = () => {
    return Periodo
            .find()
            .sort({nome:1})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getPeriodo = id => {
    return Periodo.findOne({_id:id})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.addPeriodo = p => {
    return Periodo.create(p)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.updatePeriodo = p => {
    return Periodo.updateOne({_id:p._id}, p)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deletePeriodo = id => {
    return Periodo.deleteOne({_id:id})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getPeriodoByName = pNome =>{
    return Periodo.findOne({nome:pNome})
        .then(resposta =>{
            return resposta
        })
        .catch(erro =>{
            return erro
        })
}