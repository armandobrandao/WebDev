let utilizadores = [];
let admin = new Object;
admin.nome = "admin";
admin.senha = "admin";
utilizadores.push(admin);
userAtual = null;
var userAutenticado = null;

function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function showForm() {
    document.getElementById("form").style.display = "block";
}

function listar() {
    let produtos = document.getElementById("listaProds");
    fetch('http://localhost:3002/getProds', {
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" }
    })
    .then(response => response.json())
    .then(json => {
        let lista = "";
        for (prod of json) {
            lista += prod.nome;
            lista += '<br>';
            lista += '<img src="' + prod.url + '" width="200px"><br>';
        }
        produtos.innerHTML = lista;
    });
    return;
}

function login() {
    let user = prompt("Nome de utilizador?");
    let pass = prompt("Senha?");
    for (us of utilizadores) {
        if (us.nome == user && us.senha == pass) {
            if (us.nome == admin.nome && us.senha == admin.senha) {
                document.getElementById("produtos").style.display = "block";
                document.getElementById("registar").style.display = "none";
                document.getElementById("login").style.display = "none"; 
                document.getElementById("logout").style.display = "inline"; 
                document.getElementById("inserir").style.display = "inline";
                document.getElementById("eliminar").style.display = "inline";
                document.getElementById("procurar").style.display = "inline";
                userAutenticado = us;
                listar();
                return;
            } else {
                document.getElementById("produtos").style.display = "block";
                document.getElementById("registar").style.display = "none";
                document.getElementById("login").style.display = "none";
                document.getElementById("logout").style.display = "inline";
                document.getElementById("inserir").style.display = "none";
                document.getElementById("eliminar").style.display = "none";
                document.getElementById("procurar").style.display = "block";
                userAutenticado = us;
                listar();
                return;
            }
        }
    }
    alert("Credenciais inválidas!");
}

function logout() {
    console.log("Logout");
    document.getElementById("logout").style.display = "none";
    document.getElementById("login").style.display = "inline";
    document.getElementById("registar").style.display = "inline";
    document.getElementById("produtos").style.display = "none";
}

function registar() {
    console.log("Registar");
    let utilizador = new Object();
    utilizador.nome = prompt("Username para registar:");
    utilizador.senha = prompt("Escolha uma senha:");
    utilizadores.push(utilizador);
    console.log(utilizadores);
}

function eliminar() {
    let id = prompt("ID do produto");
    fetch('http://localhost:3002/delete/' + id, {
        method: "DELETE",
        headers: { "Content-type": "application/json;charset=UTF-8" },
    })
    listar();
}

function procurar() {
    let id = prompt("ID do produto");
    fetch('http://localhost:3002/' + id, {
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" },
    })
    .then(response => response.json())
    .then(json => {
        let lista = "";
        lista += json.nome;
        lista += '<br>';
        lista += '<img src="' + json.url + '" width="200px"><br>';
        lista += '<br>';
        document.getElementById("listaProds").innerHTML = lista;
    });
}
