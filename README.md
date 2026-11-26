# API Controle Financeiro

API RESTful para gerenciamento de finanças pessoais, desenvolvida como projeto prático da disciplina de Programação Web Back-End do curso de Engenharia de Software da Universidade Tecnológica Federal do Paraná (UTFPR – Campus Cornélio Procópio).

---

## Tecnologias Utilizadas

- **Node.js** e **Express**
- **MySQL** (`mysql2`)
- **Autenticação:** JSON Web Token (`jsonwebtoken`)
- **Segurança:** Criptografia de senhas com `bcrypt`
- **Variáveis de Ambiente:** `dotenv`

---

## Instalação e Execução

1. **Clone o repositório e acesse a pasta do projeto:**
   ```bash
   git clone <url-do-repositorio>
   cd API-Controle-Financeiro
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto a partir do modelo `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. **Inicie o servidor:**
   - **Modo produção:**
     ```bash
     npm start
     ```
   - **Modo desenvolvimento (com reinicialização automática via Nodemon):**
     ```bash
     npm run dev
     ```

   O servidor será iniciado por padrão em `http://localhost:8081`.

---

## Configuração do Banco de Dados e Variáveis de Ambiente

### 1. Banco de Dados (MySQL)
1. Certifique-se de que o serviço do MySQL esteja em execução.
2. Execute o script de criação das tabelas (DDL) e o script de carga inicial (seed) disponíveis na pasta `database/` no seu cliente MySQL (MySQL Workbench ou terminal).

### 2. Variáveis de Ambiente (`.env`)
Preencha o arquivo `.env` na raiz do projeto conforme o exemplo abaixo:

```env
PORT=8081

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=controle_financeiro

JWT_SECRET=sua_chave_secreta_jwt
JWT_EXPIRES_IN=86400
```

> **Observação:** A variável `JWT_EXPIRES_IN` deve ser informada como um número inteiro em segundos (ex.: `86400` equivale a 24 horas).

---

## Credenciais do Seed

Para testar imediatamente os dados pré-populados pelo script de seed do banco de dados, utilize as credenciais abaixo no endpoint de login:

- **E-mail:** `usuario@email.com`
- **Senha:** `123456`

*(Caso tenha cadastrado outro usuário no seu arquivo `seed.sql`, utilize o e-mail e a senha definidos nele.)*

---

## Lista de Rotas

Todas as rotas protegidas exigem o envio do token JWT no cabeçalho HTTP:
`Authorization: Bearer <accessToken>`

### Autenticação e Usuário (`/auth`)
| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/register` | Não | Cadastra um novo usuário e cria categorias e conta padrão |
| `POST` | `/auth/login` | Não | Autentica o usuário e retorna o `accessToken` JWT |
| `GET` | `/auth/me` | Sim | Retorna os dados públicos do usuário autenticado |

### Categorias (`/categorias`)
| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/categorias` | Sim | Cadastra uma nova categoria (`entrada` ou `saida`) |
| `GET` | `/categorias` | Sim | Lista todas as categorias do usuário (aceita `?tipo=entrada\|saida`) |
| `GET` | `/categorias/:tipo` | Sim | Lista as categorias filtradas por tipo (`entrada` ou `saida`) |
| `PUT` | `/categorias/:id` | Sim | Atualiza nome e/ou tipo de uma categoria |
| `DELETE` | `/categorias/:id` | Sim | Remove uma categoria (bloqueado se houver lançamentos vinculados) |

### Fontes e Destinos (`/fontes-destinos`)
| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/fontes-destinos` | Sim | Cadastra uma conta corrente, carteira ou cartão de crédito |
| `GET` | `/fontes-destinos` | Sim | Lista todas as fontes e destinos do usuário |
| `PUT` | `/fontes-destinos/:id` | Sim | Atualiza os dados de uma fonte ou destino |
| `DELETE` | `/fontes-destinos/:id` | Sim | Remove uma fonte ou destino (bloqueado se houver lançamentos vinculados) |

### Lançamentos (`/lancamentos`)
| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/lancamentos` | Sim | Registra um novo lançamento (`entrada` ou `saida`) |
| `GET` | `/lancamentos` | Sim | Lista lançamentos paginados (padrão: mês corrente, 20 itens/página) |
| `PUT` | `/lancamentos/:id` | Sim | Atualiza os dados de um lançamento existente |
| `DELETE` | `/lancamentos/:id` | Sim | Exclui um lançamento |

**Parâmetros de filtro opcionais em `GET /lancamentos`:**
- `inicio` e `fim` no formato `AAAA-MM-DD`
- `tipo` (`entrada` ou `saida`)
- `categoriaId` (ID numérico da categoria)
- `fonteDestinoId` (ID numérico da fonte/destino)
- `pagina` (número inteiro maior ou igual a `1`)

### Relatórios (`/relatorios`)
| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :---: | :--- |
| `GET` | `/relatorios/categorias` | Sim | Consolida quantidade e soma de valores por categoria no período |
| `GET` | `/relatorios/fontes-destinos` | Sim | Consolida quantidade, entradas e saídas por fonte/destino no período |

**Parâmetros obrigatórios nos relatórios:**
- `inicio=AAAA-MM-DD`
- `fim=AAAA-MM-DD`

---

## Instruções para Testes

1. **Preparação:** Importe os scripts SQL no MySQL e suba a aplicação com `npm start`.
2. **Cliente HTTP:** Utilize o **Postman** ou **Insomnia** apontando para `http://localhost:8081`.
3. **Fluxo Recomendado:**
   1. Execute `POST /auth/login` com as credenciais do seed (ou crie uma conta em `POST /auth/register`) e copie o valor de `accessToken` da resposta.
   2. Configure a aba **Authorization** como **Bearer Token** colando o token obtido.
   3. Valide o perfil do usuário em `GET /auth/me` (status `200`, sem exposição de `senha_hash`).
   4. Cadastre e liste categorias (`POST /categorias`, `GET /categorias`, `GET /categorias/saida`) e fontes/destinos (`POST /fontes-destinos`, `GET /fontes-destinos`).
   5. Registre movimentações em `POST /lancamentos` e consulte `GET /lancamentos` verificando os metadados de paginação (`pagina`, `limite`, `total`, `totalPaginas`).
   6. Consulte os consolidados financeiros em `GET /relatorios/categorias?inicio=2026-11-01&fim=2026-11-30` e `GET /relatorios/fontes-destinos?inicio=2026-11-01&fim=2026-11-30`.
   7. Teste cenários de validação e erro: requisição sem token (`401`), parâmetros inválidos ou datas invertidas (`400`), recurso inexistente (`404`) e exclusão/alteração de categoria com lançamentos vinculados (`409`).
