var usuario = JSON.parse(localStorage.getItem("autenticacao"))

export function cadastrarUsuario(){

    var nome = document.getElementById("nome").value
    var email = document.getElementById("email").value
    var telefone = document.getElementById("telefone").value
    var senha = document.getElementById("senha").value
    var confirmarSenha = document.getElementById("confirmarSenha").value

    if(senha != confirmarSenha){
        alert("Senha não conferem")
        return 
    }
    
    var url = "/cadastrar"

    var body = {
        nome: nome,
        email: email,
        telefone: telefone,
        password: senha
    }

    body = JSON.stringify(body)

    fetch(url,  {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: body
    }).then((dados) => {
        if(dados.ok){
            alert("Cadastro realizado com sucesso")
            window.location = "/login"
        }else{
            throw("Erro ao cadstrar dados")
        }
    }).catch((error) => {
        alert("Erro ao cadastrar os dados" + error)
    })
}
