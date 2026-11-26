const dotenv = require("dotenv");
dotenv.config();

const express = require("express")

const app = express()
const port = process.env.PORT


app.use(express.json());

//Rotas de autenticação
app.use("/auth", require("./routes/auth"));

//Rotas de categorias
app.use("/categorias", require("./routes/categorias"));

//Rotas de fontes e destinos
app.use("/fontesDestinos", require("./routes/fontesDestinos"));
app.use('/fontes-destinos', require('./routes/fontesDestinos'));

//Rotas de lançamentos
app.use("/lancamentos", require("./routes/lancamentos"));

//Rota de relatórios
app.use("/relatorios", require("./routes/relatorios"));

//Se acontecer algum erro, nao mostra para o usuário, retorna apenas uma mensagem generica
app.use((erro, req, res, next) => {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno do servidor." });
});


app.listen(port, () => console.log(`Servidor Online. http://localhost:${port}/`));
