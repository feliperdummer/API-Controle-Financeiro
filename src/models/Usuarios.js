const connection = require('../database/connection')

class Usuario {

    criarUsuario(nome, email, cpf, senhaCript, callback) {
        const query = `INSERT INTO usuarios (nome, email, cpf, senha) VALUES (?,?,?,?)`

        connection.query(query, [nome, email, cpf, senhaCript], callback)
    }

    pegarUsuario(email, callback) {
        const query = `SELECT * FROM usuarios WHERE email = ?`;

        connection.query(query, [email], callback)
    }

    verificarEmailExistente(email, callback) {
        const query = `SELECT * FROM usuarios WHERE email = ?`;

        connection.query(query, [email], callback)
    }

    verificarCpfExistente(cpf, callback) {
         const query = `SELECT * FROM usuarios WHERE cpf = ?`;

        connection.query(query, [cpf], callback)
    }
}

module.exports = Usuario