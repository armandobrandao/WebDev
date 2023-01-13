const express = require("express");
let db = require("./config/db");
const cors = require("cors");
bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();

const PORT = 3002;
app.use(express.json());

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

const prods = [
    {
        nome: 'prod1', 
        tipo: 'tipo1'
    },
    {
        nome: 'prod2', 
        tipo: 'tipo2'
    }
]

app.get("/prods",(req,res) => {
    res.json(prods);
})

app.post("/login",(req,res) => {
    const username = req.body.username;
    const user = {nome: username};
    
    const jwttoken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)

    res.send({Token: jwttoken });

})

app.listen(3000);

function authenticateToken(req, res, next) {
    const authHeader = req.headers["autorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)
    
    jwt.verify (token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const posts = [
    {
        nome: "Becas",
        pass: "haha"
    }
]

app.get("/posts", authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})