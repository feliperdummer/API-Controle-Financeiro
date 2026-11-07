const authServices = require('../services/auth')

async function cadastrarUsuario(req, res) {
    const resposta = await authServices.cadastrarUsuario(req.body)
    console.log(resposta)
    res.status(resposta.status).json(resposta)
}

module.exports = {cadastrarUsuario}