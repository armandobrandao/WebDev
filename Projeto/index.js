const express = require("express");
let db = require("./config/db");
const cors = require("cors");
bodyParser = require('body-parser');

const app = express();

const PORT = 3002;

app.use(cors());
app.options('*', cors()) // include before other routes

app.use(express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//
// Route to get all posts
app.get("/getProds", cors(), (req, res) => {
    result = db;
    res.send(result);
});

// Route to get one post
app.get("/:id", (req, res) => {
    const id = req.params.id;
    result = "";
    for (var prod of db) {
        if (prod.id.toString() === id) {
            console.log(`Prod id: ${prod.id}`);
            result = prod;
            break;
        }
    }
    res.send(result);
});

// Route for creating the post
app.post("/create", (req, res) => {
    newID = db.length + 1;
    const nome = req.body.nome;
    const url = req.body.url;
    const preco = req.body.preco;
    console.log(req.body);
    console.log(newID, nome, url, preco);
    const newProduct = {
        "id": newID,
        "nome": nome,
        "url": url,
        "preco": preco
    }
    db.push(newProduct);
    result = newProduct;
    res.send(result);
});

// Route to delete a post

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    let result = null;
    let dbAux = [];
    for (prod of db) {
        if (prod.id.toString() === id) {
            result = prod;
        } else {
            dbAux.push(prod);
        }
    }
    db = [];
    for (let i = 0; i < dbAux.length; i++) {
        db.push(dbAux[i]); // copia os dados
    }
    console.log(result);
    res.send(result);
});

app.use(express.static('public/www'));
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

/*
app.post("/submit-form", (req, res) => {
    let product = {
        name: req.body.name,
        url: req.body.url
    }
    db.push(product);
    console.log("\nLista de produtos: ");
    for(let i = 0; i<db.length; i++){
        console.log("Produto: "+ db[i].name + " Url: " + db[i].url);
    }
    res.send("Working");
});
*/