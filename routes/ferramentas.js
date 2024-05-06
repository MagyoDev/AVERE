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
            res.status(404).send("Usuario não encontrado")
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

            res.status(500).send("Erro ao cadastrar ferramenta")

        })
    }).catch((erro) => {
        res.status(500).send("Erro ao cadastrar ferramenta" + erro)
    })

    
})

router.put('/:idFerramenta', autorizar, function(req, res, next){
    ferramentas.findOne({
        where: {
            id: req.params.idFerramenta
        }
    }).then((ferramenta) => {
        if(!ferramenta){
            res.status(404).send("Ferramenta não encontrada")
            return
        }

        if(ferramenta.userId != req.user.id){
            res.status(401).send("Usuario não autorizado")
            return
        }

        ferramenta.update({
            nome: req.body.nome,
            tipo: req.body.tipo,
            marca: req.body.marca,
            usuarioDaFerramenta: req.body.usuarioDaFerramenta
        }).then((ferramenta) => {
            res.status(200).send("Ferramenta atualizada comn sucesso")
        }).catch((error) => {
            res.status(500).send("Ero ao atualizar ferramenta")
        })


    }).catch((erro) => {
        res.status(500).send("Erro ao atualizar ferramenta" + erro)
    })
})

router.delete("/:idFerramenta", autorizar ,function(req, res, next){
    ferramentas.findOne({
        where: {
            id: req.params.idFerramenta
        }
    }).then((ferramenta) => {
        if(!ferramenta){
            res.status(404).send("Ferramenta não encontrada")
        }

        if(ferramenta.userId != req.user.id){
            res.status(401).send("Usuario nao autorizado")
            return
        }

        ferramenta.destroy().then((ferramenta) => {
            res.status(200).send("Ferramenta excluida com sucesso")
        }).catch((erro) => {
            res.status(500).send("Erro ao excluir ferramenta")
        })
    }).catch((erro) => {
        res.status(500).send("Erro ao excluir ferramenta")
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

router.get("/:idFerramenta", autorizar, function(req, res, next){

    ferramentas.findOne({
        where: {
            id: req.params.idFerramenta
        } 
    }).then((ferramenta) => {

        if(!ferramenta){
            res.status(404).send("Ferramenta não encontrada")
            return
        }
        console.log(req.user.id)
        console.log(ferramenta.id)

        if(ferramenta.userId != req.user.id){
            res.status(401).send("Usuario nao autorizado")
            return
        }

        res.status(200).send(JSON.stringify(ferramenta))
        
    }).catch((error) => {
        res.status(500).send("Erro ao listar ferramenta")
    })

})

module.exports = router