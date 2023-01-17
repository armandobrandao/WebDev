const urlBase = "https://localhost:3002/api";

async function makeRequest(url, options) {
    try {
        const response = await fetch(url, options);
        return response;
    } catch (err) {
        console.log(err);
    }
}

function showFormLogin() {
    document.getElementById("html").style.overflowY = "hidden";
    document.getElementById("formLogin").style.display = "block";
    document.getElementById("formRegistar").style.display = "none";
}

function showFormRegistar() {
    document.getElementById("html").style.overflowY = "hidden";
    document.getElementById("formRegistar").style.display = "block";
    document.getElementById("formLogin").style.display = "none"; 
}

function showFormCart() {
    document.getElementById("formCart").style.display = "block";
}

function closeForm() {
    document.getElementById("html").style.overflowY = "scroll";
    document.getElementById("formLogin").style.display = "none";
    document.getElementById("formRegistar").style.display = "none";
    document.getElementById("formCart").style.display = "none";
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
    document.getElementById("regUsername").value = '';
    document.getElementById("regPassword").value = '';
}
document.addEventListener("DOMContentLoaded", function() {
function addKeydownEvent(id) {
    document.getElementById(id).addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            if(id === "username" || id === "password")
                document.getElementById("Login").click();
            else 
                document.getElementById("Registar").click();
        }
    });
}
addKeydownEvent("username");
addKeydownEvent("password");
addKeydownEvent("regUsername");
addKeydownEvent("regPassword");
});

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
            lista += '<div class="product">';
            lista += '<h3 id="product' + prod.id + '-name"><b>' + prod.nome + '</b></h3>';
            lista += '</div>';
            lista += '<br><br>';
            lista += '<div class="zoom">';
            lista += '<img src="' + prod.url + '"style="max-width:100%; height:auto;">';
            lista += '</div>';
            lista += '<br><br>';
            lista += '<button id="addCart" onclick="addToCart(`product' + prod.id + '`, 1)"> Adicionar ao carrinho</button>';
            lista += '<p id="product' + prod.id + '-price">' + prod.preco + '</p>';
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
                if (user.username == "admin" ) {
                    document.getElementById("produtos").style.display = "block";
                    document.getElementById("prodnav").style.display = "block";
                    document.getElementById("registar").style.display = "none";
                    document.getElementById("login").style.display = "none";
                    document.getElementById("formLogin").style.display = "none"; 
                    document.getElementById("logout").style.display = "inline"; 
                    document.getElementById("inserir").style.display = "inline";
                    document.getElementById("eliminar").style.display = "inline";
                    document.getElementById("procurar").style.display = "inline";
                    document.getElementById("cart").style.display = "block";
                    document.getElementById("legenda").innerText = "Autenticar";
                    localStorage.setItem("token", json.token);
                    break;
                }
                else {
                    document.getElementById("produtos").style.display = "block";
                    document.getElementById("prodnav").style.display = "block";
                    document.getElementById("registar").style.display = "none";
                    document.getElementById("login").style.display = "none";
                    document.getElementById("formLogin").style.display = "none"; 
                    document.getElementById("logout").style.display = "inline"; 
                    document.getElementById("inserir").style.display = "none";
                    document.getElementById("eliminar").style.display = "none";
                    document.getElementById("procurar").style.display = "inline";
                    document.getElementById("cart").style.display = "block";
                    document.getElementById("legenda").innerText = "Autenticar";
                    localStorage.setItem("token", json.token);
                    break;
                }
                    
            }
        case 401:
            {
                document.getElementById("cMsg").innerHTML = json.msg;
                break;
            }
        case 404:
            {
                console.log(json.msg);
                document.getElementById("cMsg").innerHTML = json.msg;
                break;
            }
    }
}

async function registar() {
    const nome = document.getElementById("regUsername").value;
    const senha = document.getElementById("regPassword").value;
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
    document.getElementById("cart").style.display = "none";
    localStorage.removeItem("token");
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
    fetch('https://localhost:3002/delete/' + id, {
        method: "DELETE",
        headers: { "Content-type": "application/json;charset=UTF-8" },
    })
    listar();
}

function procurar() {
    let id = prompt("ID do produto");
    document.getElementById("prodList").innerHTML = "";
    fetch('https://localhost:3002/' + id, {
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" },
    })
    .then(response => response.json())
    .then(json => {
        let lista = "";
        lista += '<div class="columnleft imagebox2" style="margin: 0 auto">';
        lista += '<div class="product">';
        lista += '<h3 id="product' + json.id + '-name"><b>' + json.nome + '</b></h3>';
        lista += '</div>';
        lista += '<br><br>';
        lista += '<div class="zoom">';
        lista += '<img src="' + json.url + '"style="max-width:100%; height:auto;">';
        lista += '</div>';
        lista += '<br><br>';
        lista += '<button id="addCart" onclick="addToCart(`product' + json.id + '`, 1)"> Adicionar ao carrinho</button>';
        lista += '<p id="product' + json.id + '-price">' + json.preco + '</p>';
        lista += '</div>';
        document.getElementById("prodList").innerHTML = lista;
    });
}

function close() {
    document.getElementById("formLogin").style.display = "none";
}

// Initialize an empty cart
let cart = {};

// Add item to cart
function addToCart(product, quantity) {
    if (!cart[product]) {
        cart[product] = {
            quantity: quantity,
            price: document.getElementById(product + "-price").innerText.substring(0, document.getElementById(product + "-price").innerText.length - 1)
        };
    } else {
        cart[product].quantity += quantity;
    }
    cart[product].name = document.getElementById(product + "-name").innerText;
    updateCart();
}

// Remove item from cart
function removeFromCart(product) {
    if (cart[product]) {
        cart[product].quantity--;
        if (cart[product].quantity === 0) {
            delete cart[product];
        }
        updateCart();
    }
}

// Update the cart UI
function updateCart() {
    let cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let cartTotal = 0;
    for (let product in cart) {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${cart[product].name}</td><td>${cart[product].quantity}</td><td>${cart[product].price + "€"}</td><td>${cart[product].quantity * cart[product].price + "€"}</td><td><button onclick="removeFromCart('${product}')">Remove</button></td>`;
        cartItems.appendChild(tr);
        cartTotal += cart[product].quantity * cart[product].price;
    }
    document.getElementById("cart-total").innerText = cartTotal + "€";
    let checkoutButton = document.getElementById("checkout-button");
    if (Object.keys(cart).length === 0) {
        checkoutButton.disabled = true;
    } else {
        checkoutButton.disabled = false;
    }
}

async function api(){
    fetch('/api')
  .then(response => response.text())
  .then(dados => {
    console.log(dados)

    dados = formatarDados(dados);
    console.log('\n\n')
    console.log(dados)
  })
  .catch(error => {
    console.error(error); // exibe qualquer erro ocorrido durante a chamada à API
  });
}

function formatarDados(dados) {
    let resultado = '';

    resultado = JSON.stringify(dados)
    resultado2 = resultado.split('\\')
    resultado3 = resultado2[32].replace(/:/i, "").replace(/"/i, "").replace(/,/i, "")

    return resultado3;
  }
