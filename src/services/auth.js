const Usuarios = require('../models/Usuarios')
const bcrypt = require('bcrypt');

const emailUtils = require('../utils/email')
const cpfUtils = require('../utils/cpf')
const jwtUtils = require('../utils/jwt')

const usuarios = new Usuarios()


async function cadastrarUsuario(data) {
    const {nome, cpf, email, senha} = data || {};

    const nomeNormalizado = nome?.trim();
    const emailNormalizado = email?.trim().toLowerCase();
    const cpfNormalizado = cpf?.replace(/\D/g, '');

    if(!nomeNormalizado || nomeNormalizado.length > 120) {
        return {status: 400, mensagem: "Nome inválido."}
    }
    
    if(!cpfUtils.validar(cpfNormalizado)) {
      return {status: 400, mensagem: "CPF inválido."}  
    }

    if(await cpfUtils.verificarExistencia(cpfNormalizado)) { 
        return {status: 409, mensagem: "CPF já cadastrado."}  
    }

    if(!emailUtils.validar(emailNormalizado)) {
        return {status: 400, mensagem: "Email inválido."}
    }

    if(await (await emailUtils.verificarExistencia(emailNormalizado)).length > 0) {
        return {status: 409, mensagem: "Email já cadastrado."} 
    }

    if (!senha || senha.length < 3 || senha.length > 36) {
        return {status: 400, mensagem: "Senha Inválida."}
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    
    try {
        const usuarioDados = await usuarios.criarUsuario(nomeNormalizado, emailNormalizado, cpfNormalizado, senhaHash);

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

    const emailNormalizado = email?.trim().toLowerCase();

    if(!emailUtils.validar(emailNormalizado) || !senha || senha.length < 3 || senha.length > 36) {
        return {status: 401, mensagem: "Email ou senha inválidos."}
    }

    let usuario;
    try {
        usuario = await emailUtils.verificarExistencia(emailNormalizado)
    } catch (err) { 
        console.log(err)
        return {status: 500, mensagem: "Erro ao verificar usuário."}; 
    }

    if(!usuario || usuario.length === 0) {
        return {status: 401, mensagem: "Email ou senha inválidos." }
    }

    if(await bcrypt.compare(senha, usuario[0]?.senha_hash)) {
        const token = jwtUtils.criarToken(usuario[0].id)
        return {
            status: 200,
            mensagem: "login realizado com sucesso.",
            accessToken: token,
            usuario: {
                id: usuario[0]?.id,
                nome: usuario[0]?.nome,
                email: usuario[0]?.email
            }
        }  
    }

    return {status: 401, mensagem: "Email ou senha inválidos."}
}

async function pegarDadosUsuario(usuarioId) {
    try {
        const usuario = await usuarios.pegarUsuarioPorId(usuarioId);
        return { status: 200, usuario };
    } catch (err) {
        console.log(err);
        return { status: 500, mensagem: "Erro ao buscar usuário." };
    }
}

module.exports = {cadastrarUsuario, login, pegarDadosUsuario}