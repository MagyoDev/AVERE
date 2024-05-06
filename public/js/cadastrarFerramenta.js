var usuario = JSON.parse(localStorage.getItem("autenticacao"))

export function cadastrarFerramenta(){

    var nome = document.getElementById("nome").value
    var tipo = document.getElementById("tipo").value
    var marca = document.getElementById("marca").value
    var usuarioDaFerramenta = document.getElementById("usuarioDaFerramenta").value

    var url = "/user/" + usuario.id + "/ferramentas"

    var body = {
        nome: nome,
        tipo: tipo,
        marca: marca,
        usuarioDaFerramenta: usuarioDaFerramenta
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
            alert("Dados cadastrados com sucesso")
            window.location = "/user/" + usuario.id + "/ferramentas/listar"
        }else{
            throw("Erro ao cadstrar dados")
        }
    }).catch((error) => {
        alert("Erro ao cadastrar os dados" + error)
    })
}