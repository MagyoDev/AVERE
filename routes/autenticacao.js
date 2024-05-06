var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")
var autorizar = require("./autorizacao")
var fs = require("fs")
var chavePrivada = fs.readFileSync(__dirname + "/../chaves/chavePrivada.key")
var chavePrivadaRefreshToken = fs.readFileSync(__dirname + "/../chaves/chavePrivadaRefreshToken.key")
var chavePublicaRefreshToken = fs.readFileSync(__dirname + "/../chaves/chavePublicaRefreshToken.key")
var user = require("../models/User")
var bcrypt = require("bcrypt")

router.get('/login', function (req, res, next) {
  res.render("login")
})

router.post('/login', function (req, res, next) {

  user.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {

    if(!user){
      res.send("Usuario não encontrado").status(404)
      return
    }

    if(!bcrypt.compareSync(req.body.password, user.password)){
      res.send("Usuario nâo encontrado 1").status(404)
      return
    }

    var usuario = {
      id: user.id,
      nome: user.nome,
      email: user.email
    }

    var token = jwt.sign(usuario, chavePrivada, {algorithm: "RS256", expiresIn: 7200})
    var refreshToken = jwt.sign(usuario, chavePrivadaRefreshToken, {algorithm: "RS256", expiresIn: "20d"})

    res.send({
      exporesIn: 7200,
      token: token,
      refreshToken: refreshToken
    })

  }).catch((error) => {
    res.send("Ero a ao realizar login" + error).status(500)
  })

})


router.post("/refresh-token", function(req, res, next){

  var token = req.body.refreshToken

  jwt.verify(token, chavePublicaRefreshToken, function(err, token){
    
    if(err){
      if(err.name == "TokenExpiredError") res.status(400).send({message: "Token expirado"})
      if(err.name == "JsonWebTokenError") res.status(401).send({message: "Token invalido"})

    }else{
      var usuario = {
        id: token.id,
        nome: token.nome,
        email: token.email,
      }
      var novoToken = jwt.sign(usuario, chavePrivada, {algorithm: "RS256", expiresIn: 7200})

      res.send({
        novoToken: novoToken
      }).status(200)
    }
  })

})

router.get("/cadastrar", function(req, res, next){
  res.render("cadastrar")
})

router.post("/cadastrar", function (req, res, next) {

  var password = bcrypt.hashSync(req.body.password, 5) 

  user.create({

    nome: req.body.nome,
    email: req.body.email,
    password: password,
    telefone: req.body.telefone

  }).then((user) => {

    res.send("usuario cadastrado com sucesso").status(200)

  }).catch((error) => {

    res.send("Erro ao cadastrar usuario")

  })


})

router.get("/atualizar", function(req, res, next){
  res.render("atualizar")
})

router.put('/atualizar/:id', autorizar ,function(req, res, next){

  if(req.params.id != req.user.id){
    res.send("Usuario incorreto").status(401)
    return
  }

  user.update({
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone
  }, {
    where: {
      id: req.params.id
    }
  }).then((user) => {
    res.send("Usuario atualizado com sucesso").status(200)

  }).catch((error) => {

    res.send("Erro ao atualizar usuario").status(500)

  })

})

router.post("/atualizarSenha/:id", autorizar, function(req, res, next) {

  if(req.user.id != req.params.id){
    res.send(401)
    return 
  }

  user.update({
    password: req.body.password
  }, {
    where: {
      id: req.user.id
    }
  }).then((user) => {
    res.send("Senha atualizada com sucesso").status(200)
  }).catch((erro)=> {
    res.send("Erro ao atualizar senha").status(500)
  })
  
})

module.exports = router;
