const express = require("express");
const fs = require("fs");
const https = require("https");
const app = express();

let db = require("./config/db");
let utilizadores = require("./config/users.json");

const cors = require("cors");
bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
app.use(express());
const cookieParser = require('cookie-parser')

app.use(cookieParser())
require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3002; 

const sslServer = https.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert:fs.readFileSync('cert/certificate.pem')
}, app)

app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
})

app.use(cors());
app.options('*', cors()) 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function escreve(fich, db) {
    fs.writeFile(fich, JSON.stringify(db, null, 4), 'utf8', err => {
        if (err) {
            console.log(`Error writing file: ${err}`)
        } else {
            console.log('Escreveu no ficheiro ' + fich); // Sucesso
        }
    })
}

function existeUser(nome) {
    for (utilizador of users)
        if (utilizador.username === nome) {
            return true;
        }
    return false;
}

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
sslServer.listen(PORT, () => {
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

app.post("/registar", (req, res) => {
    const username = req.body.username;
    if (!existeUser(username)) {
        const newUser = {
            username: username,
            password: req.body.password,
            tipo: 0
        }
        if (newUser.password.length < 5) {
            return res.status(400).send({
                msg: 'Password deve ter 5 ou mais caracteres'
            });
        }
        users.push(newUser);
        escreve("./config/users.json", users);
        return res.status(201).send({
            msg: `Criado utilizador ${username}`
        });
    } else {
        return res.status(409).send({
            msg: 'Utilizador já existe'
        });
    }
});

app.post("/login", (req, res) => {
    const nome = req.body.username;
    const senha = req.body.password;
    for (utilizador of users) {
        if (utilizador.username === nome)
            if (utilizador.password === senha) {
                token = jwt.sign(utilizador, process.env.SECRET);
                return res.status(201).json({ 
                    auth: true, 
                    token: token,
                //msg: getFavoritos(utilizador.username) 
            })
            } else {
                return res.status(401).json({ msg: "Password inválida!" })
            }
    }
    return res.status(404).json({ msg: "Utilizador não encontrado!" })
});

function validarToken(token) {
    try {
        return jwt.verify(token, process.env.SECRET);
    } catch (err) {
        return false;
    }
}