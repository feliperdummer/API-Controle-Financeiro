const authServices = require('../services/auth')

function cadastrarUsuario(req, res) {
    
    const resposta = authServices.cadastrarUsuario(req.body) 
}

module.exports = {cadastrarUsuario}