var Mensagens = require("../models/mensagens")
const { $where } = require("../models/uc")

module.exports.mensagensRecebidasUtilizador = async(id) =>{
    return await Mensagens.find({destinatario:id,tipo:"utilizador"})
}

module.exports.mensagensRecebidasGrupo = async(ids) =>{
    return await Mensagens.find({destinatario:{$in:ids},tipo:"grupo"})
}

module.exports.mesagensEnviadas = async(id) =>{
    return await Mensagens.find({remetente:id})
}

module.exports.sendMessage = async (m) =>{
    return await Mensagens.create(m)
}

module.exports.deleteMessage = async (id)=>{
    return await Mensagens.deleteOne({_id:id})
}

module.exports.getMensagens = async (id)=>{
    return await Mensagens.find()
}


module.exports.validateJSON = (body)=>{
    flag = true
    if (Object.keys(body).length > 6) flag = false
    else if (!body.hasOwnProperty("tipo")) {flag = false; console.log("missing: 'tipo'")}
    else if (!body.hasOwnProperty("assunto")) {flag = false; console.log("missing: 'tipo'")}
    else if (!body.hasOwnProperty("remetente")) {flag = false; console.log("missing: 'remetente'")}
    else if (!body.hasOwnProperty("destinatario")) {flag = false; console.log("missing: 'destinatario'")}
    else if (!body.hasOwnProperty("conteudo")) {flag = false; console.log("missing: 'conteudo'")}
    else if (!body.hasOwnProperty("data")) {flag = false; console.log("missing: 'data'")}
    return flag
}