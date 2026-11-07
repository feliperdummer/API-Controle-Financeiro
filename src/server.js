const dotenv = require("dotenv");
dotenv.config();

const express = require("express")
const authRoutes = require("./routes/auth");

const app = express()
const port = process.env.PORT


app.use(express.json());

//Rotas de autenticação
app.use("/auth", authRoutes);

app.listen(port, () => console.log(`Servidor Online. http://localhost:${port}/`));
