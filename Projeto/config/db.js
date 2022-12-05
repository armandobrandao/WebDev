/* const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    user: "postuser",
    password: "",
    database: "blog_posts"
}) */
const db = [];
db.push({ "id": 1, "nome": "Comboio Choo Choo", "url": "https://images.freeimages.com/images/large-previews/622/free-toy-wooden-choo-choo-train-1641366.jpg" });
db.push({ "id": 2, "nome": "Bancos para parque", "url": "https://images.freeimages.com/images/previews/5af/park-benches-1640298.jpg" });
db.push({ "id": 3, "nome": "Querubins", "url": "https://images.freeimages.com/images/previews/7e6/trumpeting-cherubs-1640254.jpg" });

module.exports = db;