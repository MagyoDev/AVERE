const sequelize = require("../database/conexao")
const {DataTypes} = require("sequelize")
const user = require("./User")

var ferramentas = sequelize.define("ferramentas", {
    nome: {
        type: DataTypes.STRING
    },
    tipo: {
        type: DataTypes.STRING
    },
    marca: {
        type: DataTypes.STRING
    },
    usuarioDaFerramenta: {
        type: DataTypes.STRING
    }


})

//ferramentas.sync({alter: true})

module.exports = ferramentas