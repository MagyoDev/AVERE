var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")
var autorizar = require("./autorizacao")
var fs = require("fs")
var chavePrivada = fs.readFileSync(__dirname + "/../chaves/chavePrivada.key")
var chavePublica = fs.readFileSync(__dirname + "/../chaves/chavePrivada.key")
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
      res.status(404).send("Usuario não encontrado")
      return
    }

    if(!bcrypt.compareSync(req.body.password, user.password)){
      res.status(404).send("Usuario nâo encontrado 1")
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
      refreshToken: refreshToken,
      id: user.id,
      nome: user.nome,
      email: user.email
    })

  }).catch((error) => {
    res.status(500).send("Ero a ao realizar login" + error)
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

      res.status(200).send({
        novoToken: novoToken
      })
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

    res.status(200).send("usuario cadastrado com sucesso")

  }).catch((error) => {

    res.status(500).send("Erro ao cadastrar usuario")

  })


})

router.get("/atualizar", function(req, res, next){
  res.render("atualizar")
})

router.put('/atualizar/:id', autorizar ,function(req, res, next){

  if(req.params.id != req.user.id){
    res.status(401).send("Usuario incorreto")
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
    res.status(200).send("Usuario atualizado com sucesso")

  }).catch((error) => {

    res.status(500).send("Erro ao atualizar usuario")

  })

})

router.post("/atualizarSenha/:id", autorizar, function(req, res, next) {

  if(req.user.id != req.params.id){
    res.send(401)
    return 
  }

  var password = bcrypt.hashSync(req.body.password, 5)

  user.update({
    password: password
  }, {
    where: {
      id: req.user.id
    }
  }).then((user) => {
    res.status(200).send("Senha atualizada com sucesso")
  }).catch((erro)=> {
    res.status(500).send("Erro ao atualizar senha")
  })
  
})

router.get("/users/:id", autorizar,function(req, res, next){
    user.findOne({
      where: {
        id: req.user.id
      }
    }).then((user) => {

      if(!user){
        res.status(404).send("Usuario não encontrado")
        return
      }

      if(user.id != req.user.id){
        res.status(401).send("Usuario nao autorizado")
      }


      res.status(200).send(JSON.stringify(user))
    }).catch((error) => {
      res.send("Erro ao listar usuario")
    })
})

router.post("/verificarToken", function(req, res, next){
  var token = req.body.token;

  jwt.verify(token, chavePublica, {algorithms: ['RS256']}, function(err, token){
    if(err){
      if(err.name == "TokenExpiredError") res.status(400).send({message: "Token expirado"})
      if(err.name == "JsonWebTokenError") res.status(401).send({message: "Token invalido"})
    }else{
      res.status(200).send("token ok")
    }
  })
})
module.exports = router;
