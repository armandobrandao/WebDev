const express = require("express");
const fs = require("fs");
const https = require("https");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require("bcrypt");
const request = require('request');

bodyParser = require('body-parser');

let db = require("./config/products.json");
let users = require("./config/users.json");
let servs = require("./config/services.json");

require("dotenv").config();

app.use(express());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3002;

const sslServer = https.createServer({
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/certificate.pem')
}, app)

app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
})

app.get('/api', (req, res) => {
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        res.send(body)
    });
});

app.use(express.static('public/www'));
sslServer.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

app.use(cors());
app.options('*', cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function escreve(fich, db) {
    fs.writeFile(fich, JSON.stringify(db, null, 4), 'utf8', err => {
        if (err) {
            console.log(`Error writing file: ${err}`)
        } else {
            console.log('Escreveu no ficheiro ' + fich); 
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

app.get("/getProds", cors(), (req, res) => {
    result = db;
    res.send(result);
});

app.get("/prod/:idProd", (req, res) => {
    const id = req.params.idProd;
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

app.post("/createProd", (req, res) => {
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
        "preco": preco + "€"
    }
    db.push(newProduct);
    escreve("./config/products.json", db);
    result = newProduct;
    res.send(result);
});

app.delete("/deleteProd/:idProd", (req, res) => {
    const id = req.params.idProd;
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
        db.push(dbAux[i]); 
    }
    escreve("./config/products.json", db);
    console.log(result);
    res.send(result);
});


app.post("/login", async (req, res) => {
    const nome = req.body.username;
    const senha = req.body.password;
    try {
        for (utilizador of users) {
        if (utilizador.username === nome)
            if (await bcrypt.compare(senha, utilizador.password)) {
                token = jwt.sign(utilizador, process.env.SECRET);
                return res.status(201).json({
                    auth: true,
                    token: token,
                })
            } else {
                return res.status(401).json({ msg: "Invalid Password!" })
            }
        }
    } catch {
        res.status(500).send();
    }
    return res.status(404).json({ msg: "User not found!" })
});

app.listen(3000);

function authenticateToken(req, res, next) {
    const authHeader = req.headers["autorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get("/posts", authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post("/registar", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const username = req.body.username;
        if (!existeUser(username)) {
            const newUser = {
                username: username,
                password: hashedPassword,
                type: 0
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
    } catch {
        res.status(500).send();
    }
});

const options = {
    method: 'GET',
    url: 'https://covid-193.p.rapidapi.com/statistics',
    qs: { country: 'portugal' },
    headers: {
        'X-RapidAPI-Key': '05f70cb088mshc5761916a74abaap1de996jsnabbb04367815',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com',
        useQueryString: true
    }
};

app.get("/getServs", cors(), (req, res) => {
    result = servs;
    res.send(result);
});

app.get("/serv/:idServ", (req, res) => {
    const id = req.params.idServ;
    result = "";
    for (var serv of servs) {
        if (serv.id.toString() === id) {
            console.log(`Service id: ${serv.id}`);
            result = serv;
            break;
        }
    }
    res.send(result);
});

app.post("/createServ", (req, res) => {
    newID = servs.length + 1;
    const nome = req.body.nome;
    const url = req.body.url;
    const preco = req.body.preco;
    console.log(req.body);
    console.log(newID, nome, url, preco);
    const newService = {
        "id": newID,
        "nome": nome,
        "url": url,
        "preco": preco + "€"
    }
    servs.push(newService);
    escreve("./config/services.json", servs);
    result = newService;
    res.send(result);
});

app.delete("/deleteServ/:idServ", (req, res) => {
    const id = req.params.idServ;
    let result = null;
    let servAux = [];
    for (serv of servs) {
        if (serv.id.toString() === id) {
            result = serv;
        } else {
            servAux.push(serv);
        }
    }
    servs = [];
    for (let i = 0; i < servAux.length; i++) {
        servs.push(servAux[i]);
    }
    escreve("./config/services.json", servs);
    console.log(result);
    res.send(result);
});