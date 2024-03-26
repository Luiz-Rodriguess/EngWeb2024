var express = require('express');
var router = express.Router();
var Compositores = require('../controllers/compositores')
var Periodos = require('../controllers/periodos')
var moment = require('moment')

/* GET home page. */
router.get('/',function(req,res,next){
  var data = new Date().toISOString().substring(0.16)
  res.render('index',{d:data})
})

router.get('/compositores', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Compositores.compList()
    .then(resp => {
      res.render('compositores', { clist: resp, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de compositores"})
    })
});

// GET Student Form
router.get('/compositores/registo', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.periodoList()
    .then(resp =>{
      res.render('addComp', { d: data , ps: resp});
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de periodos"})
    })
});

router.get('/compositores/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Compositores.getCompositor(req.params.id)
    .then(comp => {
      comp.dataNasc = moment(comp.dataNasc).format('YYYY-MM-DD')
      comp.dataObito = moment(comp.dataObito).format('YYYY-MM-DD')
      res.render('compPage', { c: comp, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

/* GET Compositor Update page. */
router.get('/compositores/edit/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Compositores.getCompositor(req.params.id)
    .then(comp => {
      comp.dataNasc = moment(comp.dataNasc).format('YYYY-MM-DD')
      comp.dataObito = moment(comp.dataObito).format('YYYY-MM-DD')
      Periodos.periodoList()
        .then(resp =>{
          res.render('editComp', { c: comp, d: data, ps: resp });
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro na obtenção da lista de períodos"})
        })
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

/* GET Compositor Delete page. */
router.get('/compositores/delete/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Compositores.getCompositor(req.params.id)
    .then(comp => {
      comp.dataNasc = moment(comp.dataNasc).format('YYYY-MM-DD')
      comp.dataObito = moment(comp.dataObito).format('YYYY-MM-DD')
      res.render('deleteComp', { c: comp, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

router.get('/compositores/deleteConfirm/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Compositores.deleteCompositor(req.params.id)
    .then(comp => {
      res.redirect('/compositores')
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

// POST Compositor
router.post('/compositores/registo', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.getPeriodoByName(req.body.periodo)
    .then(periodo =>{
      req.body.periodo = periodo._id
      Compositores.addCompositor(req.body)
        .then(comp => {
          res.render('addCompConfirm', {c: comp,d:data})
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro no armazenamento do registo de aluno"})
        })
    })
    .catch(erro =>{
      res.render('error', {error: erro, message: "Erro no armazenamento do registo de aluno"})
    })
});


router.post('/compositores/edit/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.getPeriodoByName(req.body.periodo)
    .then(periodo =>{
      req.body.periodo = periodo._id
      Compositores.updateCompositor(req.body)
        .then(comp => {
          res.render('addCompConfirm', {c: comp,d:data})
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro no armazenamento do registo de aluno"})
        })
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro no armazenamento do registo de aluno"})
    })
});

router.get('/periodos', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.periodoList()
    .then(resp => {
      res.render('periodos', { plist: resp, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de compositores"})
    })
});

// GET Student Form
router.get('/periodos/registo', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  res.render('addPeriodo', { d: data});
});

router.get('/periodos/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.getPeriodo(req.params.id)
  .then(periodo => {
      Compositores.compListPerId(periodo.id)
        .then( comp =>{
          res.render('periodoPage', { p: periodo, d: data, c: comp });
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
        })
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

/* GET Compositor Update page. */
router.get('/periodos/edit/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.getPeriodo(req.params.id)
  .then(periodo => {
      res.render('editPeriodo', {p:periodo, d:data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

/* GET Compositor Delete page. */
router.get('/periodos/delete/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.getPeriodo(req.params.id)
    .then(periodo => {
      res.render('deletePeriodo', { p: periodo, d: data });
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

router.get('/periodos/deleteConfirm/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.deletePeriodo(req.params.id)
    .then(periodo => {
      res.redirect('/periodos')
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de compositor"})
    })
});

router.post('/periodos/registo', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.addPeriodo(req.body)
    .then(periodo =>{
      res.render('addPeriodoConfirm',{p : periodo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de períodos"})
    })
});


router.post('/periodos/edit/:id', function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Periodos.updatePeriodo(req.body)
    .then(periodo =>{
      res.render('editPeriodoConfirm',{p : periodo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de períodos"})
    })
});


module.exports = router;
