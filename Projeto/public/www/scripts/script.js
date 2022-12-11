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
    fetch('http://localhost:3002/getProds', {
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" }
    })
    .then(response => response.json())
    .then(json => {
        let lista = "";
        for (prod of json) {
            lista += '<div class="columnleft imagebox2">';
            lista += '<h3><b>' + prod.nome + '</b></h3>';
            lista += '<br><br>';
            lista += '<div class="zoom">';
            lista += '<img src="' + prod.url + '"style="max-width:100%; height:auto;">';
            lista += '</div>';
            lista += '<br><br>';
            lista += '<p>' + prod.nome + ' - ' + prod.preco + '</p>';
            lista += '</div>';
        }
        document.getElementById("prodList").innerHTML = lista;
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

function inserir() {
    let nome = prompt("Nome do produto:");
    let url = prompt("URL da imagem do produto:");
    var preco = prompt("Preço do produto:");
    let prod = new Object();
    prod.nome = nome;
    prod.url = url;
    prod.preco = preco;
    fetch('http://localhost:3002/create', {
        method: "POST",
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify(prod)
    })
    listar();
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
    document.getElementById("prodList").innerHTML = "";
    fetch('http://localhost:3002/' + id, {
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" },
    })
    .then(response => response.json())
    .then(json => {
        let lista = "";
        lista += '<div class="columnleft imagebox2">';
        lista += '<h3><b>' + json.nome + '</b></h3>';
        lista += '<br><br>';
        lista += '<div class="zoom">';
        lista += '<img src="' + json.url + '"style="max-width:100%; height:auto;">';
        lista += '</div>';
        lista += '<br><br>';
        lista += '<p>' + json.nome + ' - ' + json.preco + '</p>';
        lista += '</div>';
        document.getElementById("prodList").innerHTML = lista;
    });
}