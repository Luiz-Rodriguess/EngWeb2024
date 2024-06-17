var UC = require("../models/uc")

module.exports.getUCs = async() => {
    return await UC.find()
}

module.exports.getUCById = async(id) => {
    return await UC.findOne({_id:id})
}

module.exports.getUCsByIdList = async(ids) =>{
    return await UC.find({_id:{$in:ids}})
}

module.exports.addUC = async(uc) => {
    return await UC.create(uc)
}

module.exports.updateUC = async(uc) => {
    return await UC.updateOne({_id:uc._id},uc)
}

module.exports.deleteUC = async(id) => {
    return await UC.deleteOne({_id:id})
}

module.exports.extraInfoUC = (uc) =>{
    uc.sigla = uc._id
    uc.ano = uc._id
    uc.sigla = `[${uc.sigla.replace(/\d+/,'')}]`
    uc.ano = `[${uc.ano.replace(/[A-Za-z]+/,'')}]`
    return uc
}

module.exports.validateJSON = (body)=>{
    flag = true
    console.log(body)
    if (Object.keys(body).length > 8) flag = false
    else if (!body.hasOwnProperty("_id")) {flag = false; console.log("missing: '_id'")}
    else if (!body.hasOwnProperty("titulo")) {flag = false; console.log("missing: 'titulo'")}
    else if (!body.hasOwnProperty("docentes")) {flag = false; console.log("missing: 'docentes'")}
    else if (!body.hasOwnProperty("avaliacao")) {flag = false; console.log("missing: 'avaliacao'")}
    else if (!body.hasOwnProperty("datas")) {flag = false; console.log("missing: 'datas'")}
    else if (!body.hasOwnProperty("aulas")) {flag = false; console.log("missing: 'aulas'")}
    else if (!body.hasOwnProperty("hTeoricas")) {flag = false; console.log("missing: 'hTeoricas'")}
    else if (!body.hasOwnProperty("hPraticas")) {flag = false; console.log("missing: 'hPraticas'")}
    console.log(flag)
    return flag
}