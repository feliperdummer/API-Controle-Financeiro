**Equipe:** Equipe 07
**Arquivo:** services/auth.js

```javascript
async function cadastrarUsuario(data) {
  const { nome, cpf, email, senha } = data || {};
  const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : '';

  if (!cpfUtils.validar(cpfLimpo)) {
    return { status: 400, mensagem: 'CPF inválido.' };
  }
  if (await cpfUtils.verificarExistencia(cpfLimpo)) {
    return { status: 400, mensagem: 'CPF já cadastrado.' };
  }
  const senhaHash = await bcrypt.hash(senha, 10);
  await usuarios.criarUsuario(nome, email, cpfLimpo, senhaHash);
  return { status: 201, mensagem: 'Usuário cadastrado com sucesso.' };
}
```

**Erro (linha):** Linha 9 — retorno de status 400 quando o CPF já está cadastrado no banco
**Regra violada:** RF... / item do checklist ...
**Correção:**

```javascript
// trecho corrigido
```