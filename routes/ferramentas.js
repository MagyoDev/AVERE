var express = require('express');
var router = express.Router();
var autorizar = require("./autorizacao")
var ferramentas = require("../models/Ferramentas")
var user = require("../models/User");


router.get("/cadastrar", function(req, res, next){
    res.render("ferramentas/cadastrar")
})

router.get("/listar", function(req, res, next){
    res.render("ferramentas/listar")
})

router.get("/atualizar", function(req, res, next){
    res.render("ferramentas/atualizar")
})

router.post("/", autorizar ,function(req, res, next){

    var usuario = user.findOne({
        where: {
            id: req.user.id
        }
    }).then((usuario) => {

        if(!usuario){
            res.send("Usuario não encontrado").status(404)
            return
        }

        console.log(usuario.ferramenta)

        ferramentas.create({

            nome: req.body.nome,
            tipo: req.body.tipo,
            marca: req.body.marca,
            usuarioDaFerramenta: req.body.usuarioDaFerramenta

        }).then((ferramenta) => {

            usuario.addFerramentas(ferramenta)

            res.send("Ferramenta cadastrada com sucesso")

        }).catch((erro) => {

            res.send("Erro ao cadastrar ferramenta").status(500)

        })
    }).catch((erro) => {
        res.send("Erro ao cadastrar ferramenta" + erro).status(500)
    })

    
})

router.put('/:idFerramenta', autorizar, function(req, res, next){
    ferramentas.findOne({
        where: {
            id: req.params.idFerramenta
        }
    }).then((ferramenta) => {
        if(!ferramenta){
            res.send("Ferramenta não encontrada").status(404)
            return
        }

        if(ferramenta.userId != req.user.id){
            res.send("Usuario não autorizado").status(401)
            return
        }

        ferramenta.update({
            nome: req.body.nome,
            tipo: req.body.tipo,
            marca: req.body.marca,
            usuarioDaFerramenta: req.body.usuarioDaFerramenta
        }).then((ferramenta) => {
            res.send("Ferramenta atualizada comn sucesso").status(200)
        }).catch((error) => {
            res.send("Ero ao atualizar ferramenta").status(500)
        })


    }).catch((erro) => {
        res.send("Erro ao atualizar ferramenta" + erro).status(500)
    })
})

router.delete("/:idFerramenta", autorizar ,function(req, res, next){
    ferramentas.findOne({
        where: {
            id: req.params.idFerramenta
        }
    }).then((ferramenta) => {
        if(!ferramenta){
            res.send("Ferramenta não encontrada").status(404)
        }

        if(ferramenta.userId != req.user.id){
            res.send("Usuario nao autorizado").status(401)
            return
        }

        ferramenta.destroy().then((ferramenta) => {
            res.send("Ferramenta excluida com sucesso").status(200)
        }).catch((erro) => {
            res.send("Erro ao excluir ferramenta").status(500)
        })
    }).catch((erro) => {
        res.send("Erro ao excluir ferramenta").status(500)
    })
})

router.get("/", autorizar, function(req, res, next){
    ferramentas.findAll({
        where: {
            userId: req.user.id
        }
    }).then((ferramentas) => {
        res.send(JSON.stringify(ferramentas))
    })
})

module.exports = router