const authServices = require('../services/auth')

async function cadastrarUsuario(req, res) {
    const resposta = await authServices.cadastrarUsuario(req.body)
    res.status(resposta.status).json(resposta)
}

async function login(req, res) {
    const resposta = await authServices.login(req.body)
    res.status(resposta.status).json(resposta)
}

module.exports = {cadastrarUsuario, login}