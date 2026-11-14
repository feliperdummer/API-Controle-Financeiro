const Usuarios = require('../models/Usuarios')
const usuarios = new Usuarios()

function validar(email) {
    if (!email || email.length > 160) {
        return false
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
        return false
    }

    return true
}


async function verificarExistencia(email) {
    try {
        const resultado = await usuarios.verificarEmailExistente(email);

        return resultado;

    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {validar, verificarExistencia }