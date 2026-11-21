const connection = require('../database/connection');

class Categorias {

    listar(usuarioId, tipo) {
        let query = `SELECT id, nome, tipo, criado_em FROM categorias WHERE usuario_id = ?`;
        const params = [usuarioId];

        if (tipo) {
            query += ` AND tipo = ?`;
            params.push(tipo);
        }

        query += ` ORDER BY tipo ASC, nome ASC`;

        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado);
            });
        });
    }

    buscarPorId(id, usuarioId) {
        const query = `SELECT id, nome, tipo, criado_em FROM categorias WHERE id = ? AND usuario_id = ? LIMIT 1`;

        return new Promise((resolve, reject) => {
            connection.query(query, [id, usuarioId], (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado[0] || null);
            });
        });
    }

    cadastrar(usuarioId, { nome, tipo }) {
        const query = `INSERT INTO categorias (usuario_id, nome, tipo) VALUES (?, ?, ?)`;

        return new Promise((resolve, reject) => {
            connection.query(query, [usuarioId, nome, tipo], (err, resultado) => {
                if (err) return reject(err);

                resolve({
                    id: resultado.insertId,
                    nome,
                    tipo
                });
            });
        });
    }

    atualizar(id, usuarioId, { nome, tipo }) {
        const query = `UPDATE categorias SET nome = ?, tipo = ? WHERE id = ? AND usuario_id = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, [nome, tipo, id, usuarioId], (err, resultado) => {
                if (err) return reject(err);
                if (resultado.affectedRows === 0) return resolve(null);

                resolve({
                    id: Number(id),
                    nome,
                    tipo
                });
            });
        });
    }

    possuiLancamentos(id, usuarioId) {
        const query = `SELECT COUNT(*) AS total FROM lancamentos WHERE categoria_id = ? AND usuario_id = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, [id, usuarioId], (err, resultado) => {
                if (err) return reject(err);

                resolve(Number(resultado[0].total) > 0);
            });
        });
    }

    deletar(id, usuarioId) {
        const query = `DELETE FROM categorias WHERE id = ? AND usuario_id = ?`;

        return new Promise((resolve, reject) => {
            connection.query(query, [id, usuarioId], (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado.affectedRows > 0);
            });
        });
    }
}

module.exports = Categorias;