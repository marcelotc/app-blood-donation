const express = require('express');
const server = express();

//configurar servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    post: 5432,
    database: 'blood_donation'
});

server.get("/", function (req, res) {

    db.query("SELECT * from donors", function (err, result) {
        if (err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
});

server.post("/", function (req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        if (err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
});

server.listen(3000, function () {
    console.log('iniciei o servidor')
});