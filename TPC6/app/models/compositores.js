const mongoose = require('mongoose')

var compositorSchema = new mongoose.Schema({
    _id: { type:String, required:true },
    nome: { type:String, required:true },
    bio: String,
    dataNasc: { type:Date, required:true },
    dataObito: { type:Date, required:true },
    periodo: { type:String, required:true }
})

module.exports = mongoose.model('Compositores',compositorSchema,"comp")