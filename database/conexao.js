const {Sequelize} = require("sequelize")

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('gui', 'root', 'senha', {
    host: 'localhost',
    dialect: 'mysql'
  });

try{

sequelize.authenticate()

}catch(error){
    console.log("Erro ao conectar com o banco de dados: " + error)
}

module.exports = sequelize
