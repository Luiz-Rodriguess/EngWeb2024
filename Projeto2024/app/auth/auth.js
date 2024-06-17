const bcrypt = require("bcryptjs")
const Utilizador = require("../controllers/utilizadores")

const TIMEOUT = 3600000 // 1 hora
//const TIMEOUT = 1000 // 1 segundo -> para teste

module.exports.validate = function(req,res,next) {
    var URLtoken = req.cookies.token
    var id = req.cookies.id
    Utilizador.getUtilizadorById(id).then(resp =>{
        if (resp.token){
            if (URLtoken !== resp.token){
                res.redirect("/")
            }else{
                loginDate = new Date(resp.time)
                now = new Date()
                if (now-loginDate > TIMEOUT){
                    module.exports.logout(id).then(
                        res.redirect("/")
                    ).catch(err=>console.log(err))
                }else{
                    next()
                }
            }
        }else{
            res.redirect("/")
        }
    }).catch(err =>{
        console.log(err)
        res.redirect("/")
    })
}

module.exports.genToken = async(body) =>{
    user = await Utilizador.getUtilizadorById(body._id).catch(err=>console.log(err))
    var token
    if (user){
        let flag = await bcrypt.compare(body.pass,user.pass)
        if (flag){
            token = Math.random().toString(36).substring(2)
            user.token = token
            user.time = new Date().toISOString()
            await Utilizador.updateUtilizador(user).catch(err=>console.log(err))
        }else token = 1
    }else token = 0
    return token
}

module.exports.logout = async function(id){
    resp = await Utilizador.getUtilizadorById(id).catch(err=>console.log(err))
    resp.token = null
    resp.time = null
    await Utilizador.updateUtilizador(resp).catch(err=>console.log(err))
}

module.exports.newAccount = async function(body){
    let time = new Date().toISOString()
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(body.pass,salt)
    let token = Math.random().toString(36).substring(2)
    body.pass = hashedPassword
    body.token = token
    body.time = time
    await Utilizador.addUtilizador(Utilizador.templateUtilizador(body)).catch(err=>console.log(err))
    return token
}