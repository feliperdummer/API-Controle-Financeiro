const dotenv = require("dotenv");
dotenv.config();

const express = require("express")

const app = express()
const port = process.env.PORT


app.use(express.json());

//Rotas de autenticação
app.use("/auth", require("./routes/auth"));
app.use("/lancamentos", require("./routes/lancamentos"));

app.listen(port, () => console.log(`Servidor Online. http://localhost:${port}/`));
