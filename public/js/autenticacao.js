export function login(email, senha){
    var body = {
        email: email,
        password: senha
    }

    body = JSON.stringify(body)
    
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: body
    }).then((data) => {
        if(!data.ok){
            throw("usuario não encontrado")
        }

        return data
    })
    .then((data) => data.json())
    .then((data) => {

        var usuario = {
            token: data.token,
            refreshToken: data.refreshToken,
            id: data.id,
            nome: data.nome,
            email: data.email 
        }

        localStorage.setItem("autenticacao", JSON.stringify(usuario))
        window.location = "/user/" + data.id + "/ferramentas/listar"

    }).catch((erro) => {

        console.log("Erro ao realizar login " + erro)

    })
}

export function estaLogado(){

    var usuario = JSON.parse(localStorage.getItem("autenticacao"))
    
    if(!localStorage.getItem("autenticacao")){
        window.location = "/login"
    }else{
        var url = "/verificarToken"

        var body = {
            token: usuario.token
        }
    
        body = JSON.stringify(body)
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: body
        })
        .then((data)=> {
            if(data.ok){
                return
            }else{
                refreshToken(usuario.refreshToken)
            }
        }).catch((error) => {
            alert("Erro ao verificar login " + error)
        })
    }


}

function refreshToken(token){
    var url = "/refresh-token"

    var body = {
        refreshToken: token
    }

    body = JSON.stringify(body)

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).then(async (data) => {

        if(data.ok){

            var usuario = localStorage.getItem("autenticacao")
            var novoToken = await data.json()

            var novosDados = {
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                token: novoToken.novoToken,
                refreshToken: usuario.refreshTOken
            }

            localStorage.setItem("autenticacao", novosDados)
        }else{
            deslogar()
        }

    })
}

export function deslogar(){
    localStorage.removeItem("autenticacao")
    window.location = "/login"
}