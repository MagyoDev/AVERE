const sequelize = require("../database/conexao")
const {DataTypes} = require("sequelize")

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


module.exports = ferramentas