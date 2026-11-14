const Usuarios = require('../models/Usuarios')
const bcrypt = require('bcrypt');

const emailUtils = require('../utils/email')
const cpfUtils = require('../utils/cpf')
const jwtUtils = require('../utils/jwt')

const usuarios = new Usuarios()


async function cadastrarUsuario(data) {
    const {nome, cpf, email, senha} = data || {};

    if(!nome || nome.length > 120) {
        return {
            status: 400,
            mensagem: "Nome inválido."
        }
    }
    
    if(!cpfUtils.validar(cpf) || await cpfUtils.verificarExistencia(cpf.replace(/\D/g, ''))) {
      return {
            status: 400,
            mensagem: "CPF inválido."
        }  
    }

    if(!emailUtils.validar(email) || await (await emailUtils.verificarExistencia(email)).length > 0) {
        return {
            status: 400,
            mensagem: "Email inválido."
        }
    }

    if (!senha || senha.length < 6 || senha.length > 36) {
        return {
            status: 400,
            mensagem: "Senha Inválida."
        }
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    
    try {
        const usuarioDados = await usuarios.criarUsuario(nome, email, cpf.replace(/\D/g, ''), senhaHash);

        return {
            status: 201,
            mensagem: "Usuário cadastrado com sucesso.",
            usuario: usuarioDados
        };

    } catch (err) {
        console.log(err)
        return {
            status: 500,
            mensagem: "Erro ao cadastrar usuário."
        };
    }
}

async function login(data) {
    const {email, senha} = data

    if(!emailUtils.validar(email)) {
        return {
            status: 400,
            mensagem: "Email inválido."
        }
    }

    if(!senha || senha.length < 0 || senha.length > 36) {
        return {
            status: 400,
            mensagem: "Senha inválido."
        }
    }

    const usuario = await emailUtils.verificarExistencia(email)
    if(await bcrypt.compare(senha, usuario[0].senha_hash)) {
        const token = jwtUtils.criarToken(usuario[0].id)
        return {
            status: 200,
            mensagem: "login realizado com sucesso.",
            acessToken: token
        }  
    }

    return {
        status: 401,
        mensagem: "Email ou senha inválidos."
    }
}


module.exports = {cadastrarUsuario, login}