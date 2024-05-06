var jwt = require("jsonwebtoken")
var fs = require("fs")
var chavePublica = fs.readFileSync(__dirname + "/../chaves/chavePublica.key")

function autorizar(req, res, next){

    var token = req.headers['authorization']

    if(!token || req.headers["content-type"] != "application/json"){

       res.status(400).send("Requisicao invalida")

    }else{

        token = token.split(" ")
        
        if(token.length != 2){
            res.status(401).send({message: "Token invalido"})
            return
        }

        jwt.verify(token[1], chavePublica, {algorithms: ['RS256']}, function(err, user){
            if(err){
                if(err.name == "TokenExpiredError") res.status(400).send({message: "Token expirado"})
                if(err.name == "JsonWebTokenError") res.status(401).send({message: "Token invalido"})
            }else{
                req.user = jwt.decode(token[1])
                next()
            }
        })
     
    }

}

module.exports = autorizar
