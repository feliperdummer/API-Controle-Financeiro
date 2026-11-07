const Usuarios = require('../models/Usuarios')
const bcrypt = require('bcrypt');
const emailUtils = require('../utils/email')
const cpfUtils = require('../utils/cpf')
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

    if(!emailUtils.validar(email) || await emailUtils.verificarExistencia(email)) {
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
        await new Promise((resolve, reject) => {
            usuarios.criarUsuario(nome, email, cpf.replace(/\D/g, ''), senhaHash, (err, resultado) => {
                if (err) return reject(err);

                resolve(resultado);
            });
        });

        return {
            status: 201,
            mensagem: "Usuário cadastrado com sucesso."
        };

    } catch (err) {
        console.log(err)
        return {
            status: 500,
            mensagem: "Erro ao cadastrar usuário."
        };
    }
}

module.exports = {cadastrarUsuario}