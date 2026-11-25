const connection = require('../database/connection');

class Relatorios {
    porCategoria(usuarioId, inicio, fim) {
        const sql = `
            SELECT
                c.id AS categoria_id,
                c.nome AS categoria,
                c.tipo,
                COUNT(l.id) AS quantidade_lancamentos,
                COALESCE(SUM(l.valor), 0) AS total
            FROM categorias c
            LEFT JOIN lancamentos l
                ON l.categoria_id = c.id
                AND l.usuario_id = ?
                AND l.data >= ?
                AND l.data <= ?
            WHERE c.usuario_id = ?
            GROUP BY c.id, c.nome, c.tipo
            ORDER BY c.tipo ASC, total DESC, c.nome ASC
        `;

        const parametros = [usuarioId, inicio, fim, usuarioId];

        return new Promise((resolve, reject) => {
            connection.query(sql, parametros, (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }

    porFonteDestino(usuarioId, inicio, fim) {
        const sql = `
            SELECT
                fd.id AS fonte_destino_id,
                fd.nome AS fonte_destino,
                fd.tipo,
                fd.limite,
                COUNT(l.id) AS quantidade_lancamentos,
                COALESCE(SUM(CASE WHEN l.tipo = 'entrada' THEN l.valor ELSE 0 END), 0) AS entradas,
                COALESCE(SUM(CASE WHEN l.tipo = 'saida' THEN l.valor ELSE 0 END), 0) AS saidas
            FROM fontes_destinos fd
            LEFT JOIN lancamentos l
                ON l.fonte_destino_id = fd.id
                AND l.usuario_id = ?
                AND l.data >= ?
                AND l.data <= ?
            WHERE fd.usuario_id = ?
            GROUP BY fd.id, fd.nome, fd.tipo, fd.limite
            ORDER BY fd.tipo ASC, fd.nome ASC
        `;

        const parametros = [usuarioId, inicio, fim, usuarioId];

        return new Promise((resolve, reject) => {
            connection.query(sql, parametros, (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }
}

module.exports = Relatorios;