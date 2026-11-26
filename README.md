# API Controle Financeiro

API REST de controle financeiro pessoal, desenvolvida como projeto final da disciplina de Programação Web Back-end (UTFPR – Cornélio Procópio).

**Equipe:** Carlos Eduardo Gonçalves · Felipe Rodrigues Dummer · João Caetano Biagio Lins

Um usuário se cadastra, faz login e registra **lançamentos** (entradas e saídas) ligados a uma **categoria** e a uma **fonte/destino** (conta, renda ou cartão de crédito). A API gera relatórios em JSON e a previsão de faturas dos cartões.

---

## Tecnologias

Node.js · Express · MySQL (`mysql2`) · JWT (`jsonwebtoken`) · `bcrypt` · `dotenv` · `nodemon` (dev)

---

## Como executar

### 1. Pré-requisitos
- Node.js 18+
- MySQL 8.0.16+ (necessário para as restrições `CHECK`)

### 2. Instalar dependências
```bash
git clone https://github.com/feliperdummer/API-Controle-Financeiro.git
cd API-Controle-Financeiro
npm install
```

### 3. Criar o banco
```bash
mysql -u root -p < src/database/schema.sql
mysql -u root -p < src/database/seed.sql
```

### 4. Configurar o `.env`
```bash
cp .env.example .env
```

```env
PORT=8081
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=api_financas
JWT_SECRET=uma_frase_longa_e_dificil_de_adivinhar
JWT_EXPIRES_IN=3600
```

`JWT_EXPIRES_IN` é em segundos (3600 = 1 hora). O `.env` não é versionado; use o `.env.example` como modelo.

### 5. Subir a API
```bash
npm run dev    # desenvolvimento (nodemon)
npm start      # produção
```
A API fica em `http://localhost:8081`.

---

## Dados de teste (seed)

Senha de ambos os usuários: **`backend1`**

| Usuário | E-mail | CPF |
|---|---|---|
| Ana Silva | `ana@email.com` | 529.982.247-25 |
| Carlos Souza | `carlos@email.com` | 153.509.460-56 |

O seed contém 2 usuários, lançamentos de setembro a novembro de 2026, um cartão de crédito e uma compra parcelada em 3x. O usuário Carlos serve para testar o isolamento de dados (RF3).

---

## Estrutura do projeto

```
src/
├── server.js
├── database/     connection.js · schema.sql · seed.sql
├── middleware/   auth.js            (validação do JWT)
├── routes/       um Router por recurso
├── controllers/  recebem req/res e chamam os services
├── services/     validações e regras de negócio
├── models/       classes com todo o SQL (consultas parametrizadas)
└── utils/        cpf.js · email.js · datas.js · faturas.js · jwt.js
testes/requisicoes.md   comandos curl de todas as rotas
```

SQL somente em `models/`. Módulos em CommonJS.

---

## Autenticação

Todas as rotas, exceto cadastro e login, exigem o cabeçalho:

```
Authorization: Bearer <accessToken>
```

Cada usuário só enxerga os próprios dados: o id vem sempre do token, e pedir um registro de outro usuário retorna `404`.

---

## Rotas

### Auth
| Método | Rota | Auth | Descrição |
|---|---|:-:|---|
| POST | `/auth/cadastro` | Não | Cria usuário, categorias padrão e "Conta corrente" (em transação) |
| POST | `/auth/login` | Não | Retorna `accessToken` |
| GET | `/auth/me` | Sim | Dados do usuário autenticado (sem `senha_hash`) |

Cadastro: `nome`, `email`, `cpf` (com dígitos verificadores válidos) e `senha` (mínimo 8 caracteres, com letras e números). E-mail e CPF são normalizados e únicos no banco (`409` indicando o campo duplicado).

### Categorias e Fontes/Destinos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/categorias?tipo=saida` | Lista (filtro opcional) |
| POST | `/categorias` | Cria (`201`; nome repetido no mesmo tipo → `409`) |
| PUT | `/categorias/:id` | Atualiza (inexistente ou de outro usuário → `404`) |
| DELETE | `/categorias/:id` | Exclui (`204`; com lançamentos → `409`) |

`/fontes-destinos` tem as mesmas rotas. O `tipo` deve ser `renda`, `conta` ou `cartao_credito`; para cartão, `dia_fechamento`, `dia_vencimento` (1 a 31) e `limite` (> 0) são obrigatórios.

### Lançamentos
| Método | Rota | Descrição |
|---|---|---|
| GET | `/lancamentos` | Lista com filtros, paginação (20 por página) e resumo do período |
| GET | `/lancamentos/:id` | Detalha |
| POST | `/lancamentos` | Cria (com `parcelas`, cria uma linha por parcela) |
| PUT | `/lancamentos/:id` | Atualiza |
| DELETE | `/lancamentos/:id?todasParcelas=true` | Exclui a parcela ou todas da compra |

Filtros opcionais do `GET`: `inicio`, `fim` (`AAAA-MM-DD`), `tipo`, `categoriaId`, `fonteDestinoId`, `pagina`. O padrão é o mês corrente.

Regras: `valor > 0`; `data` válida; o tipo da categoria deve ser igual ao tipo do lançamento; categoria e fonte/destino devem ser do mesmo usuário. Parcelamento só em cartão de crédito (1 a 48): todas as parcelas têm a **mesma data da compra**, o mesmo `grupo_parcelamento`, e a diferença de centavos vai para a primeira parcela (R$ 100,00 em 3x → 33,34 + 33,33 + 33,33).

### Relatórios
| Método | Rota | Descrição |
|---|---|---|
| GET | `/relatorios/categorias?inicio=&fim=` | Saídas e entradas por categoria, percentual e comparação com o período anterior |
| GET | `/relatorios/fontes-destinos?inicio=&fim=` | Entradas por fonte, saídas por destino e saldo das contas |
| GET | `/relatorios/faturas?meses=3` | Fatura atual e próximas de cada cartão, limite utilizado e disponível |

`inicio` e `fim` são obrigatórios (`inicio <= fim`). Totais calculados com `SUM`/`GROUP BY` no SQL e devolvidos como número.

**Regra de fechamento das faturas:** compra feita antes do dia de fechamento entra na fatura do mês; no dia do fechamento ou depois, entra na do mês seguinte. A parcela *k* cai *k − 1* meses depois da primeira. Se o vencimento for maior que o fechamento, vence no mesmo mês; senão, no mês seguinte. Dias inexistentes viram o último dia do mês.

---

## Padrão de erros

Todas as respostas de erro seguem o mesmo formato:

```json
{
  "erro": "Dados inválidos.",
  "campos": { "valor": "O valor deve ser maior que zero." }
}
```

| Código | Uso |
|---|---|
| 200 / 201 / 204 | Sucesso / criado / excluído |
| 400 | Campos ausentes, formato inválido, regra de negócio violada |
| 401 | Token ausente, inválido ou expirado; credenciais erradas |
| 404 | Registro inexistente ou de outro usuário; rota inexistente |
| 409 | E-mail/CPF duplicado, nome repetido, exclusão com vínculos |
| 500 | Erro inesperado (detalhe só no `console.error`) |

---

## Testes

Todos os comandos `curl` estão em [`testes/requisicoes.md`](testes/requisicoes.md). Fluxo sugerido:

1. `POST /auth/login` com `ana@email.com` / `Senha123` e copiar o `accessToken`.
2. Testar categorias, fontes/destinos e lançamentos (incluindo uma compra parcelada no cartão).
3. Consultar os três relatórios.
4. Validar os erros: sem token (`401`), id de outro usuário (`404`), saída com categoria de entrada (`400`), cadastro repetido com e-mail em maiúsculas ou CPF com pontuação (`409`).