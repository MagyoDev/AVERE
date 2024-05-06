var usuario = JSON.parse(localStorage.getItem("autenticacao"))

function buscarDados(){
    var id = new URLSearchParams(window.location.search)
    id= id.get("id")
    var url = "/user/" + usuario.id + "/ferramentas/" + id

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
        document.getElementById("tipo").value = dados.tipo
        document.getElementById("marca").value = dados.marca
        document.getElementById("usuarioDaFerramenta").value = dados.usuarioDaFerramenta
    }).catch((error) => {
        alert("Erro ao encontrar ferramenta")
    })

}

function atualizarFerramenta(){
    var id = new URLSearchParams(window.location.search)
    id= id.get("id")

    var nome = document.getElementById("nome").value
    var tipo = document.getElementById("tipo").value
    var marca = document.getElementById("marca").value
    var usuarioDaFerramenta = document.getElementById("usuarioDaFerramenta").value

    var url = "/user/" + usuario.id + "/ferramentas/" + id

    var body = {
        nome: nome,
        tipo: tipo,
        marca: marca,
        usuarioDaFerramenta: usuarioDaFerramenta
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
            alert("Dados atualizados com sucesso")
            window.location = "/user/" + usuario.id + "/ferramentas/listar"
        }else{
            throw("Erro ao atualizar dados")
        }
    }).catch((error) => {
        alert("Erro ao listar os dados" + error)
    })
}

buscarDados()

document.getElementById("enviar").addEventListener("click", atualizarFerramenta)