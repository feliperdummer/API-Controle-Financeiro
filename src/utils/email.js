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


function verificarExistencia(email) {
    usuarios.verificarEmailExistente(email, (err, resultado) => {
        if (err) {
            return false
        }

        if(resultado.length > 0) {
            return true
        }
    })
}

module.exports = {validar, verificarExistencia }