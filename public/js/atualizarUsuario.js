var usuario = JSON.parse(localStorage.getItem("autenticacao"))

export function buscarDados(){
    var id = new URLSearchParams(window.location.search)
    id= id.get("id")

    var url = "/users/"+usuario.id

    fetch(url, {
        METHOD: "GET",
        headers: {
            Authorization: "Bearer " + usuario.token,
            "Content-Type": "application/json"
        }
    })
    .then((dados) => {
        if(!dados.ok){
            throw("ferramenta nao encontrada")
        }

        return dados
    })
    .then((data) => data.json())
    .then((dados) => {
        document.getElementById("nome").value = dados.nome
        document.getElementById("email").value = dados.email
        document.getElementById("telefone").value = dados.telefone
    }).catch((error) => {
        alert("Erro ao encontrar ferramenta")
    })

}


export function atualizarUsuario(){

    var nome = document.getElementById("nome").value
    var email = document.getElementById("email").value
    var telefone = document.getElementById("telefone").value

    var url = "/atualizar/" + usuario.id

    var body = {
        nome: nome,
        email: email,
        telefone: telefone
    }

    body = JSON.stringify(body)

    fetch(url,  {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + usuario.token,
            "Content-Type": "application/json"
        },
        body: body
    }).then((dados) => {
        if(dados.ok){
            alert("Cadastro atualizado com sucesso")
            window.location = "/atualizar"
        }else{
            throw("Erro ao atualizar os dados")
        }
    }).catch((error) => {
        alert("Erro ao atualizar os dados" + error)
    })
}

export function atualizarSenha(){
    var senha = document.getElementById("senha").value
    var novaSenha = document.getElementById("novaSenha").value

    if(senha != novaSenha){
        alert("Senha não conferem")
        return 
    }
    

    var url = "/atualizarSenha/" + usuario.id

    var body = {
        password: senha,
        novaPassowrd: novaSenha
    }

    body = JSON.stringify(body)

    fetch(url,  {
        method: "POST",
        headers: {
            Authorization: "Bearer " + usuario.token,
            "Content-Type": "application/json"
        },
        body: body
    }).then((dados) => {
        if(dados.ok){
            alert("Senha atualizada com sucesso")
            window.location = "/atualizar"
        }else{
            throw("Erro ao salvar senha")
        }
    }).catch((error) => {
        alert("Erro ao atualizar senha" + error)
    })
}