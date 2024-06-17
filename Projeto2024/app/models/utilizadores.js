const mongoose = require("mongoose")

var utilizadorSchema = new mongoose.Schema({
    _id : {type:String,required:true},
    nome : {type:String,required:false},
    foto : {type:String,required:false},
    categoria : {type:String,required:false},
    filiacao : {type:String,required:false},
    email : {type:String,required:false},
    webpage : {type:String,required:false},
    ucs : {type:[String],required:false},
    type : {type:String,required:false},
    pass : {type:String,required:true},
    token : {type:String,required:false},
    time : {type:String,required:false}},
    {versionKey:false}
)

module.exports = mongoose.model("utilizadores",utilizadorSchema,"utilizadores")