const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'api_financas',
    dateStrings: true,
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco', err);
        return;
    }
    console.log("Banco de dados Conectado!")
});

module.exports = connection