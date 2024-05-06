export function mudarRotas(){
    var usuario = localStorage.getItem("autenticacao")
    var id = 0

    if(usuario){
        usuario = JSON.parse(usuario)
        id = usuario.id
    }

    var url = "/user/" + id + "/ferramentas/"

    document.getElementById("rotaCadastrar").setAttribute("href", url + "cadastrar")
    document.getElementById("rotaConsultar").setAttribute("href", url + "listar")
}