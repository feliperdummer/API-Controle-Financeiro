const Usuarios = require('../models/Usuarios')
const usuarios = new Usuarios()

const emailUtils = require('../utils/email')

function cadastrarUsuario(data) {
    const {nome, cpf, email, senha} = data;

    if(!nome || nome.length > 120) {
        return {
            status: 400,
            mensagem: "Nome inválido."
        }
    }
    
    if(!emailUtils.validar(email) || emailUtils.verificarExistencia(email)) {
        return {
            status: 400,
            mensagem: "Email inválido."
        }
    }
}

module.exports = {cadastrarUsuario}