const connection = require('../database/connection');

class Lancamentos {
    criar(lancamentos) {
        const sql = `
            INSERT INTO lancamentos
                (usuario_id, tipo, descricao, valor, data, categoria_id,
                fonte_destino_id, parcela_atual, total_parcelas, grupo_parcelamento)
            VALUES ?
        `;

        const valores = lancamentos.map((lancamento) => [
            lancamento.usuarioId,
            lancamento.tipo,
            lancamento.descricao,
            lancamento.valor,
            lancamento.data,
            lancamento.categoriaId,
            lancamento.fonteDestinoId,
            lancamento.parcelaAtual,
            lancamento.totalParcelas,
            lancamento.grupoParcelamento
        ]);

        return new Promise((resolve, reject) => {
            connection.beginTransaction((erro) => {
                if (erro) return reject(erro);

                connection.query(sql, [valores], (erro, resultado) => {
                    if (erro) {
                        return connection.rollback(() => reject(erro));
                    }

                    connection.commit((erro) => {
                        if (erro) {
                            return connection.rollback(() => reject(erro));
                        }

                        resolve({
                            id: resultado.insertId,
                            quantidade: resultado.affectedRows
                        });
                    });
                });
            });
        });
    }

    listar(usuarioId, filtros = {}) {
        const condicoes = ['usuario_id = ?', 'data >= ?', 'data <= ?'];
        const parametros = [usuarioId, filtros.inicio, filtros.fim];

        if (filtros.tipo) {
            condicoes.push('tipo = ?');
            parametros.push(filtros.tipo);
        }
        if (filtros.categoriaId) {
            condicoes.push('categoria_id = ?');
            parametros.push(filtros.categoriaId);
        }
        if (filtros.fonteDestinoId) {
            condicoes.push('fonte_destino_id = ?');
            parametros.push(filtros.fonteDestinoId);
        }

        const pagina = filtros.pagina || 1;
        const limite = 20;
        const deslocamento = (pagina - 1) * limite;
        const sql = `
            SELECT * FROM lancamentos
            WHERE ${condicoes.join(' AND ')}
            ORDER BY data DESC, id DESC
            LIMIT ? OFFSET ?
        `;

        parametros.push(limite, deslocamento);

        return new Promise((resolve, reject) => {
            connection.query(sql, parametros, (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado);
            });
        });
    }

    buscarPorId(id, usuarioId) {
        const sql = 'SELECT * FROM lancamentos WHERE id = ? AND usuario_id = ?';

        return new Promise((resolve, reject) => {
            connection.query(sql, [id, usuarioId], (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado[0] || null);
            });
        });
    }

    async atualizar(id, usuarioId, dados) {
        const sql = `
            UPDATE lancamentos
            SET tipo = ?, descricao = ?, valor = ?, data = ?,
                categoria_id = ?, fonte_destino_id = ?
            WHERE id = ? AND usuario_id = ?
        `;

        await new Promise((resolve, reject) => {
            connection.query(sql, [
                dados.tipo,
                dados.descricao,
                dados.valor,
                dados.data,
                dados.categoriaId,
                dados.fonteDestinoId,
                id,
                usuarioId
            ], (erro) => {
                if (erro) return reject(erro);
                resolve();
            });
        });

        return this.buscarPorId(id, usuarioId);
    }

    async excluir(id, usuarioId, apagarGrupo) {
        const lancamento = await this.buscarPorId(id, usuarioId);
        if (!lancamento) return false;

        const sql = apagarGrupo && lancamento.grupo_parcelamento
            ? 'DELETE FROM lancamentos WHERE usuario_id = ? AND grupo_parcelamento = ?'
            : 'DELETE FROM lancamentos WHERE id = ? AND usuario_id = ?';
        const parametros = apagarGrupo && lancamento.grupo_parcelamento
            ? [usuarioId, lancamento.grupo_parcelamento]
            : [id, usuarioId];

        return new Promise((resolve, reject) => {
            connection.query(sql, parametros, (erro, resultado) => {
                if (erro) return reject(erro);
                resolve(resultado.affectedRows > 0);
            });
        });
    }
}

module.exports = Lancamentos;
