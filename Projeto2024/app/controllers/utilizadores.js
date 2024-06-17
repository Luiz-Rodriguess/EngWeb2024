var Utilizador = require("../models/utilizadores")

module.exports.getUtilizadores = async() => {
    return await Utilizador.find()
}

module.exports.getUtilizadorById = async(id) => {
    return await Utilizador.findOne({_id:id})
}

module.exports.getUtilizadoresByList = async(ids) =>{
    return await Utilizador.find({_id:{$in:ids}})
}

module.exports.addUtilizador = async(u) => {
    return await Utilizador.create(u)
}

module.exports.updateUtilizador = async(u) => {
    return await Utilizador.updateOne({_id:u._id},u)
}

module.exports.deleteUtilizador = async(id) => {
    return await Utilizador.deleteOne({_id:id})
}

module.exports.addUCToUtilizadores = async(ucID,userList) =>{
    return await Utilizador.updateMany({_id:{$in:userList}},{$addToSet:{ucs:ucID}})
}

module.exports.removeUCFromUtilizadores = async(ucID,userList) =>{
    return await Utilizador.updateMany({_id:{$in:userList}},{$pull:{ucs:ucID}})
}

module.exports.getIdsENomes = async() =>{
    return await Utilizador.find({},{_id:1,nome:1})
}

module.exports.templateUtilizador = (body) =>{
    return {_id:body._id,
            nome:body._id,
            foto:"",
            categoria:"",
            filiacao:"",
            email:"",
            webpage:"",
            token:body.token,
            time:body.time,
            pass:body.pass,
            ucs:[]}
}

module.exports.validateJSON = (body)=>{
    flag = true
    if (Object.keys(body).length > 12) flag = false
    return flag
}