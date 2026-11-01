const express = require("express")
const dotenv = require("dotenv");
const usuariosRoutes = require("./routes/usuarios");
dotenv.config();

const app = express()
const port = process.env.PORT


app.use(express.json());
app.use("/", usuariosRoutes);

app.listen(port, () => console.log(`Servidor Online. http://localhost:${port}/`));
