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

app.listen(port, () => console.log(`Servidor Online. http://localhost:${port}/`));
