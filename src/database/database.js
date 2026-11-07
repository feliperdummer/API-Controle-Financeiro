const mysql = require("mysql2");

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'api_financas',
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco', err);
        return;
    }
    console.log("Banco de dados Conectado!")
});

module.exports = connection