var usuario = JSON.parse(localStorage.getItem("autenticacao"))

export function listarFerramentas(){

    var url = "/user/" + usuario.id + "/ferramentas"

    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + usuario.token
        }
    }).then(async (data) => {
        if(!data.ok){
            throw("Erro ao listar ferramentas")
        }

        return data
    })
    .then((data) => data.json())
    .then((data) => {

        data.map((dados) => {

        var tabela = document.querySelector("#tabela")

        var nome = document.createElement("td")

        nome.innerHTML = dados.nome
        nome.classList.add("p-4")

        var tipo = document.createElement("td")
        tipo.classList.add("p-4")

        tipo.innerHTML = dados.tipo

        var marca = document.createElement("td")
        marca.classList.add("p-4")

        marca.innerHTML = dados.marca

        var usuarioDaFerramenta = document.createElement("td")
        usuarioDaFerramenta.classList.add("p-4")

        usuarioDaFerramenta.innerHTML = dados.usuarioDaFerramenta

        var botoes = document.createElement("td")
        botoes.classList.add("p-4")

        var botaoAtualizar = document.createElement("button")
            botaoAtualizar.addEventListener("click", function(event){
                atualizar(dados.id)
            })

        botaoAtualizar.innerHTML = "atualizar"
        botaoAtualizar.classList = "p-2 bg-blue-900 rounded m-2 text-white"

        var botaoExcluir = document.createElement("button")
            botaoExcluir.addEventListener("click", function(event){
                excluir(dados.id)
        })

        botaoExcluir.innerHTML = "excluir"
        botaoExcluir.classList = "p-2 bg-red-900 rounded m-2 text-white"


        botoes.appendChild(botaoAtualizar)
        botoes.appendChild(botaoExcluir)

        var linha = document.createElement("tr")

        linha.appendChild(nome)

        linha.appendChild(tipo)

        linha.appendChild(marca)

        linha.appendChild(usuarioDaFerramenta)

        linha.appendChild(botoes)


        tabela.appendChild(linha)

    })


    })
    
}

export function atualizar(id){
    var url = "/user/" + usuario.id + "/ferramentas/atualizar?id=" + id 
    window.location = url
}

export function excluir(id){
    var url = "/user/" + usuario.id + "/ferramentas/" + id
    fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + usuario.token,
            "Content-Type": "application/json"
        }
    }).then((data) => {
        alert("Excluido com sucesso")
        window.location =  "/user/" + usuario.id + "/ferramentas/listar"
    }).catch((data) => {
        alert(" Erro ao atualizar")
    })
}

