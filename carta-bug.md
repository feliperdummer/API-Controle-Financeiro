**Equipe:** Equipe 01
**Membros:**
    - Carlos Eduardo Gonçalves (2706946)
    - João Caetano Biagio Lins (2717506)
    - Felipe Rodrigues Dummer (2706962)
**Arquivo:** models/Lancamentos.js

```javascript
//Arquivo: models/Lancamentos.js
async function buscarPorId(id) {
  const [r] = await db.query(
    `SELECT id, descricao, valor, data FROM lancamentos WHERE id = ?`,
    [id]
  );
  return r[0] || null;
}

module.exports = { buscarPorId };
```

**Erro (linha):** Linha 4 — a consulta filtra pelo ID do lançamento, mas não pelo `usuario_id`; assim, um usuário pode acessar o lançamento de outra pessoa.
**Regra violada:** RF3 — isolamento dos dados por usuário; cada usuário só pode consultar os próprios lançamentos.
**Correção:**

```javascript
async function buscarPorId(id, usuarioId) {
  const [r] = await db.query(
    `SELECT id, descricao, valor, data FROM lancamentos WHERE id = ? AND usuario_id = ?`,
    [id, usuarioId]
  );
  return r[0] || null;
}

module.exports = { buscarPorId };
```
