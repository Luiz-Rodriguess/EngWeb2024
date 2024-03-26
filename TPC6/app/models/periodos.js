const mongoose = require('mongoose')

var periodosSchema = new mongoose.Schema({
    _id: { type:String, required:true },
    nome: { type:String, required:true },
})

module.exports = mongoose.model('Periodos',periodosSchema,"per")