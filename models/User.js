const sequelize = require("../database/conexao")
const {DataTypes} = require("sequelize")
var ferramentas = require("./Ferramentas")

var user = sequelize.define("user", {
    nome: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    telefone: DataTypes.STRING,
    password: DataTypes.STRING
});

user.hasMany(ferramentas)

//sequelize.sync({alter: true})

module.exports = user