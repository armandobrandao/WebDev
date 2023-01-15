const urlBase = "https://localhost:3002/api";

async function makeRequest(url, options) {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (err) {
        console.log(err);
    }
}

function showForm() {
    document.getElementById("formLogin").style.display = "block";
}

function listar() {
    fetch('https://localhost:3002/getProds', {
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

async function login() {
    const nome = document.getElementById("username").value;
    const senha = document.getElementById("password").value;
    const user = {
        username: nome,
        password: senha,
    };
    const resposta = await makeRequest("https://localhost:3002/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    json = await resposta.json();
    switch (resposta.status) {
        case 201:
            {
                document.getElementById("produtos").style.display = "block";
                document.getElementById("prodnav").style.display = "block";
                document.getElementById("registar").style.display = "none";
                document.getElementById("login").style.display = "none";
                document.getElementById("formLogin").style.display = "none"; 
                document.getElementById("logout").style.display = "inline"; 
                document.getElementById("inserir").style.display = "inline";
                document.getElementById("eliminar").style.display = "inline";
                document.getElementById("procurar").style.display = "inline";
                document.getElementById("legenda").innerText = "Autenticar";
                localStorage.setItem("token", json.token);
                break;
            }
        case 401:
            {
                document.getElementById("pMsg").innerHTML = json.msg;
                break;
            }
        case 404:
            {
                console.log(json.msg);
                document.getElementById("pMsg").innerHTML = json.msg;
                break;
            }
    }
}

async function registar() {
    const nome = document.getElementById("username").value;
    const senha = document.getElementById("password").value;
    const user = {
        username: nome,
        password: senha,
    };
    const resposta = await makeRequest("https://localhost:3002/registar", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    });
    json = await resposta.json();
    switch (resposta.status) {
        case 409:
            {
                // Utilizador já existe
                document.getElementById("pMsg").innerHTML = json.msg;
                break;
            }
        case 400:
            {
                // Password inaceitável
                document.getElementById("pMsg").innerHTML = json.msg;
                break;
            }
        case 201:
            {
                // Utilizador registado
                document.getElementById("pMsg").innerHTML = json.msg;
                break;
            }
    }
}

function myFunction() {
    var x = document.getElementById("topnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
}

function logout() {
    console.log("Logout");
    document.getElementById("logout").style.display = "none";
    document.getElementById("login").style.display = "inline";
    document.getElementById("registar").style.display = "inline";
    document.getElementById("produtos").style.display = "none";
    document.getElementById("prodnav").style.display = "none";
}

function inserir() {
    let nome = prompt("Nome do produto:");
    let url = prompt("URL da imagem do produto:");
    let preco = prompt("Preço do produto:");
    let prod = new Object();
    prod.nome = nome;
    prod.url = url;
    prod.preco = preco;
    fetch('https://localhost:3002/create', {
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

/*
document.querySelector("login").addEventListener("click", function() {
    document.querySelector(".formLogin").classList.add("active")
});
*/
function close() {
    document.getElementById("formLogin").style.display = "none";
}