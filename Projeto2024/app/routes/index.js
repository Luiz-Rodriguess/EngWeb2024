var express = require('express');
var router = express.Router();
var Utilizador = require("../controllers/utilizadores")
var UC = require("../controllers/uc")
var Mensagens = require("../controllers/mensagens")
var auth = require("../auth/auth");
var event = require("../public/javscripts/event")
var fs = require("fs")
var path = require("path")
var multer = require('multer');
const uc = require('../models/uc');
const { group } = require('console');
var upload = multer({dest: 'uploads'})

let control = { userAlreadyExists:false,
                differentPasswords:false,
                userNotFound:false,
                wrongPassword:false}

function createUCTemplate(body){
  newUC =  {  "_id":body._id,
              "titulo":body.titulo}
  newUC.aulas = JSON.parse(body.aulas)
  newUC.datas = JSON.parse(body.datas)
  if (body.hTeoricas instanceof Array) newUC.hTeoricas = body.hTeoricas
  else newUC.hTeoricas = new Array(body.hTeoricas)
  if (body.hPraticas instanceof Array) newUC.hPraticas = body.hPraticas
  else newUC.hPraticas = new Array(body.hPraticas)
  if (body.avaliacao instanceof Array) newUC.avaliacao = body.avaliacao
  else newUC.avaliacao = new Array(body.avaliacao)
  if (body.docentes instanceof Array) newUC.docentes = body.docentes
  else newUC.docentes = new Array(body.docentes)
  return newUC
}
/* GET home page. */
router.get('/' ,function(req, res, next) {
  res.redirect("/login")
});

router.get('/login' ,function(req, res, next) {
  res.render("login",{title:"Whiteboard",control:control})
});

router.get('/register' ,function(req, res, next) {
  res.render("register",{title:"Criar conta", control:control})
});

router.get('/main', auth.validate , async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  res.render('main', { title: 'Menu Principal' ,utilizador:utilizador});
});

router.get('/user', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  res.render('user', { title: 'Utilizador' , utilizador:utilizador});
});


router.get('/curso/new', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  if (utilizador.type === "produtor" || utilizador.type === "admin"){
    res.render('curso_new', { title: 'Curso', utilizador:utilizador});
  }else{
    res.redirect("/cursos")
  }
});

router.post('/curso/new', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  if (utilizador.type === "admin" || utilizador.type === "produtor"){
    template = createUCTemplate(req.body)
    await Utilizador.addUCToUtilizadores(req.body._id,template.docentes)
    await Utilizador.addUCToUtilizadores(req.body._id,["admin"])
    await UC.addUC(template)
    console.log(template)
    res.redirect("/curso/"+template._id)
  }else{
    res.redirect("/cursos")
  }
});

router.post('/curso/new/json', auth.validate, upload.single('newUC'), async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let filePath = path.join(__dirname , '/../' , req.file.path)
  if (utilizador.type !== "consumidor"){
    fs.readFile(filePath, async (err,data)=>{
      if(err) console.log(err)
      if (data){
        let newUC = await JSON.parse(data)
        if (await UC.getUCById(newUC._id)){}
        else{
          await Utilizador.addUCToUtilizadores(newUC._id,newUC.docentes)
          await Utilizador.addUCToUtilizadores(newUC._id,"admin")
          await UC.addUC(newUC)
        }
      }
    })
  }
  fs.unlink(filePath,err=>console.log(err))
  res.redirect('/cursos')
})

router.get('/curso/delete/:cid', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let utilizadorList = await Utilizador.getUtilizadores()
  let uc = await UC.getUCById(req.params.cid).catch(err => console.log(err))
  if (uc.docentes.includes(utilizador._id) || utilizador.type === "admin"){
    await Utilizador.removeUCFromUtilizadores(uc._id,utilizadorList)
    await UC.deleteUC(req.params.cid)
  }
  res.redirect("/cursos")
});

router.get('/curso/:cid', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let uc = await UC.getUCById(req.params.cid).catch(err => console.log(err))
  if (uc){
    uc = UC.extraInfoUC(uc)
    let docentes = await Utilizador.getUtilizadoresByList(uc.docentes)
    let flag = uc.docentes.includes(utilizador._id) || utilizador.type === "admin"
    uc.hPraticas.sort()
    uc.hTeoricas.sort()
    res.render('curso', { title: 'Curso', utilizador:utilizador,uc:uc,docentes:docentes,flag:flag});
  }else{
    res.redirect("/cursos")
  }
});

router.get('/curso/edit/:cid', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let uc = await UC.getUCById(req.params.cid).catch(err => console.log(err))
  uc = UC.extraInfoUC(uc)
  let docentes = await Utilizador.getUtilizadoresByList(uc.docentes)
  if (uc.docentes.includes(utilizador._id) || utilizador.type === "admin"){
    res.render('curso_edit', { title: 'Curso', utilizador:utilizador,uc:uc,docentes:docentes});
  }else{
    res.redirect("/curso/"+req.params.cid)
  }
});

router.post('/curso/edit/:cid', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  if (utilizador.type === "admin" || utilizador.type === "produtor"){
    template = createUCTemplate(req.body)
    await UC.updateUC(template)
    await Utilizador.addUCToUtilizadores(template._id,template.docentes)
    console.log(template)
    res.redirect("/curso/"+template._id)
  }else{
    res.redirect("/cursos")
  }
});

router.get('/curso/download/:cid', auth.validate, async function(req, res, next) {
  let uc = await UC.getUCById(req.params.cid).catch(err => console.log(err))
  const tempFilePath = path.join(__dirname,"../public/fileStore/tmp",`${uc._id}.json`)
  if(uc){
    fs.writeFile(tempFilePath,JSON.stringify(uc,null,2),(err) =>{
      if(err) console.log (err)

      res.download(tempFilePath,`${uc._id}.json`, (err) =>{
        if(err) console.log (err)
        
        fs.unlink(tempFilePath, (err) => console.log(err))
      })
    })
  }
});

router.get('/cursos/download', auth.validate, async function(req, res, next) {
  let ucs = await UC.getUCs()
  const tempFilePath = path.join(__dirname,"../public/fileStore/tmp","ucs.json")
  if(uc){
    fs.writeFile(tempFilePath,JSON.stringify(ucs,null,2),(err) =>{
      if(err) console.log (err)

      res.download(tempFilePath,`ucs.json`, (err) =>{
        if(err) console.log (err)
        
        fs.unlink(tempFilePath, (err) => console.log(err))
      })
    })
  }
});

router.get('/users/download', auth.validate, async function(req, res, next) {
  let utilizadores = await Utilizador.getUtilizadores()
  const tempFilePath = path.join(__dirname,"../public/fileStore/tmp","utilizadores.json")
  if(uc){
    fs.writeFile(tempFilePath,JSON.stringify(utilizadores,null,2),(err) =>{
      if(err) console.log (err)

      res.download(tempFilePath,`utilizadores.json`, (err) =>{
        if(err) console.log (err)
        
        fs.unlink(tempFilePath, (err) => console.log(err))
      })
    })
  }
});

router.post('/users/new', auth.validate, upload.single('utilizadores'), async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let filePath = path.join( __dirname , '/../' , req.file.path)
  if (utilizador.type === "admin"){
    fs.readFile(filePath, async (err,data)=>{
      if(err) console.log(err)
      if (data){
        let utilizadores = JSON.parse(data)
        utilizadores.forEach(async (u) =>{
          if (u._id != "admin"){
            await Utilizador.deleteUtilizador(u._id).catch(err=>{console.log(err)})
            await Utilizador.addUtilizador(u)
          }
        })
      }
    })
  }
  fs.unlink(filePath,err=>console.log(err))
  res.redirect('/ferramentas')
})

router.post('/cursos/new', auth.validate, upload.single('ucs'), async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let filePath = path.join(__dirname , '/../' , req.file.path)
  if (utilizador.type === "admin"){
    fs.readFile(filePath, async (err,data)=>{
      if(err) console.log(err)
      if (data){
        let ucs = JSON.parse(data)
        ucs.forEach(async (uc) =>{
          await UC.deleteUC(uc._id).catch(err=>{console.log(err)})
          await UC.addUC(uc)
          await Utilizador.addUCToUtilizadores(uc._id,uc.docentes)
          await Utilizador.addUCToUtilizadores(uc._id,"admin")
        })
      }
    })
  }
  fs.unlink(filePath,err=>console.log(err))
  res.redirect('/ferramentas')
})

router.get('/cursos', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let ucs = await UC.getUCsByIdList(utilizador.ucs)
  for (let uc of ucs){
    uc = UC.extraInfoUC(uc)
  }
  res.render('cursos', { title: 'Cursos',utilizador:utilizador,ucs:ucs});
});

router.get('/calendario', auth.validate, async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let ucs = await UC.getUCsByIdList(utilizador.ucs)
  let eventos = []
  for (let i=0;i<ucs.length;i++){
    eventos.push(...event.createEvents(ucs[i]))
  }
  let today = new Date()
  console.log(today.getFullYear(), today.getMonth(),today.getDate(),today.getDay())
  let weekly = eventos.filter((e)=>{return e instanceof event.WeeklyEvent})
  eventos = eventos.filter((e)=>{return e instanceof event.Event})
  res.render('calendario', { title: 'Calendário',utilizador:utilizador,eventos:eventos,weekly:weekly});
});

router.post('/login', async function(req, res, next) {
  control.wrongPassword = false
  control.userNotFound = false
  let token = await auth.genToken(req.body)
  if (token == 0) control.userNotFound = true
  else if (token == 1) control.wrongPassword = true
  else {
    res.cookie('token',token)
    res.cookie('id',req.body._id)
    res.redirect(`/cursos`)
  }
  if (control.userNotFound || control.wrongPassword) res.redirect("/login")
});

router.post("/register", async function(req,res,next){
  control.userAlreadyExists = false
  control.differentPasswords = false
  let user = await Utilizador.getUtilizadorById(req.body._id).catch(err=>{console.log(err)})
  if (user){
    control.userAlreadyExists = true
  }else{
    console.log(req.body.pass,req.body.cpass)
    if (req.body.pass === req.body.cpass){
      let token = await auth.newAccount(req.body)
      res.cookie("token",token)
      res.cookie("id",req.body._id)
      res.redirect(`/main`)
    }else{
      control.differentPasswords = true
    }
  }
  if (control.differentPasswords || control.userAlreadyExists){
    res.redirect("/register")
  }
})

router.get("/logout", auth.validate, async function(req,res,next){
  await auth.logout(req.cookies.id)
  res.cookie("token",null)
  res.cookie("id",null)
  res.redirect("/")
})

router.get("/ferramentas", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let ucs = await UC.getUCs()
  ucs = ucs.filter(uc =>{
    return utilizador.type === "admin" || uc.docentes.includes(utilizador._id)
  })
  res.render("ferramentas",{title:"Ferramentas",ucs:ucs,utilizador:utilizador})
})

router.post("/ferramentas", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  console.log(req.body)
  if (req.body.tipo === "addUtilizadores"){
    let uc = await UC.getUCById(req.body.ucID)
    if (uc.docentes.includes(utilizador._id) || utilizador.type === "admin"){
      req.body.userList = JSON.parse(req.body.userList)
      await Utilizador.addUCToUtilizadores(req.body.ucID,req.body.userList)
    }
  }
  else if (req.body.tipo === "removeUtilizadores"){
    let uc = await UC.getUCById(req.body.ucID)
    if (uc.docentes.includes(utilizador._id) || utilizador.type === "admin"){
      req.body.userList = JSON.parse(req.body.userList)
      await Utilizador.removeUCFromUtilizadores(req.body.ucID,req.body.userList)
    }
  }
  res.redirect("/ferramentas")
})

router.get("/mensagens", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let groupMessages = await Mensagens.mensagensRecebidasGrupo(utilizador.ucs)
  let messages = (groupMessages.concat(await Mensagens.mensagensRecebidasUtilizador(utilizador._id))).sort((a,b)=>{
    return new Date(b.data) - new Date(a.data)
  }).filter(m => {return m.remetente !== utilizador._id})
  let sentMessages = (await Mensagens.mesagensEnviadas(utilizador._id)).sort((a,b)=>{
    return new Date(b.data) - new Date(a.data)
  })
  res.render("mensagens",{title:"Mensagens",messages:messages,sentMessages,utilizador:utilizador})
})

router.get("/mensagens/new", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let utilizadores = await Utilizador.getIdsENomes()
  res.render("mensagens_new",{title:"Mensagens",utilizadores:utilizadores,utilizador:utilizador})
})

router.post("/mensagens/new", auth.validate, async function(req,res,next){
  req.body.destinatario = JSON.parse(req.body.destinatario)
  await Mensagens.sendMessage(req.body).catch(err => console.log(err))
  res.redirect("/mensagens")
})

router.get('/mensagens/download', auth.validate, async function(req, res, next) {
  let mensagens = await Mensagens.getMensagens()
  const tempFilePath = path.join(__dirname,"../public/fileStore/tmp","mensagens.json")
  if(mensagens){
    fs.writeFile(tempFilePath,JSON.stringify(mensagens,null,2),(err) =>{
      if(err) console.log (err)

      res.download(tempFilePath,"mensagens.json", (err) =>{
        if(err) console.log (err)
        
        fs.unlink(tempFilePath, (err) => console.log(err))
      })
    })
  }
});

router.post('/mensagens/json', auth.validate, upload.single('mensagens'), async function(req, res, next) {
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  let filePath = path.join(__dirname , '/../' , req.file.path)
  if (utilizador.type === "admin"){
    fs.readFile(filePath, async (err,data)=>{
      if(err) console.log(err)
      if (data){
        let mensagens = JSON.parse(data)
        mensagens.forEach(async (m) =>{
          await Mensagens.deleteMessage(m._id).catch(err=>{console.log(err)})
          await Mensagens.sendMessage(m)
        })
      }
    })
  }
  fs.unlink(filePath,err=>console.log(err))
  res.redirect('/ferramentas')
})

router.get("/user/edit", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  res.render("user_edit",{title:"Utilizador",utilizador:utilizador})
})

router.post("/user/edit", auth.validate, upload.single("foto"), async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  if (req.cookies.id === utilizador._id){
    if (req.hasOwnProperty("file")){
      let filePath = path.join(__dirname,"..",req.file.path)
      fs.readFile(filePath, async (err,data)=>{
        if(err) console.log(err)
        if (data){
          req.body.foto = utilizador._id + ".png"
          let newPath = path.join(__dirname,"../public/fileStore/profile",`${utilizador._id}.png`)
          fs.rename(filePath,newPath, (err) => console.log(err))
          await Utilizador.updateUtilizador(req.body)
        }
      })
    }else{
      req.body.foto= utilizador.foto
      await Utilizador.updateUtilizador(req.body)
    }
  }
  res.redirect("/user")
})

router.get("/user/delete", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  if (utilizador.type === "admin"){
    let utilizadores = await Utilizador.getIdsENomes()
    res.render("user_delete",{title:"Remover Utilizador",utilizador:utilizador,utilizadores:utilizadores})
  }else{
    res.redirect("/main")
  }
})

router.get("/user/delete/:uid", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  if (utilizador.type === "admin"){
    utilizadorRem = await Utilizador.getUtilizadorById(req.params.uid) 
    res.render("user_delete_confirm",{title:"Remover Utilizador",utilizador:utilizador,utilizadorRem:utilizadorRem})
  }else{
    res.redirect("/main")
  }
})

router.post("/user/delete/:uid", auth.validate, async function(req,res,next){
  let utilizador = await Utilizador.getUtilizadorById(req.cookies.id).catch(err => console.log(err))
  if (utilizador.type === "admin"){
    await Utilizador.deleteUtilizador(req.params.uid)
  }
  res.redirect("/ferramentas")
})

router.get("*",function(req,res,next){
  res.redirect("/main")
})

module.exports = router;
