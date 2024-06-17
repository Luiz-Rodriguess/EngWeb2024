const mongoose = require("mongoose")

const datasSchema = new mongoose.Schema({
    teste : {type:String,required:false},
    exame : {type:String,required:false},
    projeto : {type:String,required:false}
})

const aulasSchema = new mongoose.Schema({
    tipo : {type:String,required:false},
    data : {type:String,required:false},
    sumario : {type:[String],required:false},
    aulaId : {type:String,required:false}
})

var ucSchema = new mongoose.Schema({
    _id : {type:String,required:true},
    titulo : {type:String,required:true},
    docentes : {type:[String],required:false},
    hTeoricas : {type:[String],required:false},
    hPraticas : {type:[String],required:false},
    avaliacao : {type:[String],required:false},
    datas : {type:datasSchema,required:false},
    aulas : {type:[aulasSchema],required:false}},
    {versionKey : false}
)

module.exports = mongoose.model("UC",ucSchema,"uc")