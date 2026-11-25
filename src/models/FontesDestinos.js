const connection = require('../database/connection');

class FontesDestinos {
    listar(usuarioId, tipo) {
        const condicoes = ['usuario_id = ?'];
        const parametros = [usuarioId];

        if (tipo) {
            condicoes.push('tipo = ?');
            parametros.push(tipo);
        }

        const sql = `
            SELECT * FROM fontes_destinos
            WHERE ${condicoes.join(' AND ')}
            ORDER BY tipo ASC, nome ASC
        `;

        return new Promise((resolve, reject) => {
            connection.query(sql, parametros, (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }

    buscarPorId(id, usuarioId) {
        const sql = 'SELECT * FROM fontes_destinos WHERE id = ? AND usuario_id = ?';

        return new Promise((resolve, reject) => {
            connection.query(sql, [id, usuarioId], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado[0] || null);
            });
        });
    }

    async cadastrar(usuarioId, dados) {
        const sql = `
            INSERT INTO fontes_destinos
                (usuario_id, nome, tipo, dia_fechamento, dia_vencimento, limite)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const resultado = await new Promise((resolve, reject) => {
            connection.query(sql, [
                usuarioId,
                dados.nome,
                dados.tipo,
                dados.dia_fechamento,
                dados.dia_vencimento,
                dados.limite
            ], (erro, res) => {
                if (erro) return reject(erro);
                resolve(res);
            });
        });

        return this.buscarPorId(resultado.insertId, usuarioId);
    }

    async atualizar(id, usuarioId, dados) {
        const sql = `
            UPDATE fontes_destinos
            SET nome = ?, tipo = ?, dia_fechamento = ?, dia_vencimento = ?, limite = ?
            WHERE id = ? AND usuario_id = ?
        `;

        await new Promise((resolve, reject) => {
            connection.query(sql, [
                dados.nome,
                dados.tipo,
                dados.dia_fechamento,
                dados.dia_vencimento,
                dados.limite,
                id,
                usuarioId
            ], (erro) => {
                if (erro) return reject(erro);
                resolve();
            });
        });

        return this.buscarPorId(id, usuarioId);
    }

    possuiLancamentos(id, usuarioId) {
        const sql = 'SELECT COUNT(*) AS total FROM lancamentos WHERE fonte_destino_id = ? AND usuario_id = ?';

        return new Promise((resolve, reject) => {
            connection.query(sql, [id, usuarioId], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado[0].total > 0);
            });
        });
    }

    deletar(id, usuarioId) {
        const sql = 'DELETE FROM fontes_destinos WHERE id = ? AND usuario_id = ?';

        return new Promise((resolve, reject) => {
            connection.query(sql, [id, usuarioId], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado.affectedRows > 0);
            });
        });
    }
}

module.exports = FontesDestinos;