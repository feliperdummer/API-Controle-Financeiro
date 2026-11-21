const connection = require('../database/connection')

const CATEGORIAS_PADRAO = [
    {nomeCat: 'Alimentação', tipo: 'saida'},
    {nomeCat: 'Transporte', tipo: 'saida'},
    {nomeCat: 'Saúde', tipo: 'saida'},
    {nomeCat: 'Salário', tipo: 'entrada'},
];

class Usuario {

    criarUsuario(nome, email, cpf, senhaHash) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction((erro) => {
                if (erro) return reject(erro);

                const sqlUsuario = `INSERT INTO usuarios (nome, email, cpf, senha_hash) VALUES (?, ?, ?, ?)`;

                connection.query(sqlUsuario, [nome, email, cpf, senhaHash], (erro, resultado) => {
                    if (erro) {
                        return connection.rollback(() => reject(erro));
                    }

                    const usuarioId = resultado.insertId;
                    const linhas = CATEGORIAS_PADRAO.map(({nomeCat, tipo}) => [usuarioId, nomeCat, tipo]);
                    const sqlCategorias = `INSERT INTO categorias (usuario_id, nome, tipo) VALUES ?`;

                    connection.query(sqlCategorias, [linhas], (erro) => {
                        if (erro) {
                            return connection.rollback(() => reject(erro));
                        }

                        const sqlFonte = `
                            INSERT INTO fontes_destinos (usuario_id, nome, tipo)
                            VALUES (?, 'Conta corrente', 'conta')
                        `;

                        connection.query(sqlFonte, [usuarioId], (erro) => {
                            if (erro) {
                                return connection.rollback(() => reject(erro));
                            }

                            connection.commit((erro) => {
                                if (erro) {
                                    return connection.rollback(() => reject(erro));
                                }

                                resolve({id: usuarioId, nome, email});
                            });
                        });
                    });
                });
            });
        });
    }

    pegarUsuario(email) {
        const query = `SELECT * FROM usuarios WHERE email = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, [email], (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado);
            });
        });
    }

    pegarUsuarioPorId(id) {
        const query = `SELECT * FROM usuarios WHERE id = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado);
            });
        });
    }

    verificarEmailExistente(email) {
        const query = `SELECT * FROM usuarios WHERE email = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, [email], (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado);
            });
        });
    }

    verificarCpfExistente(cpf) {
        const query = `SELECT * FROM usuarios WHERE cpf = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, [cpf], (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado);
            });
        });
    }
}

module.exports = Usuario