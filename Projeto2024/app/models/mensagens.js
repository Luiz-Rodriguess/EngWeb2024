const mongoose = require("mongoose")

var mensagesSchema = new mongoose.Schema({
    tipo:{type:String,required:true},
    remetente:{type:String,required:true},
    destinatario:{type:[String],required:true},
    data:{type:String,required:true},
    conteudo:{type:String,required:true},
    assunto:{type:String,required:true}},
    {versionKey:false}
)

module.exports = mongoose.model("mensagens",mensagesSchema,"mensagens")