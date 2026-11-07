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
    return new Promise((resolve, reject) => {
        usuarios.verificarEmailExistente(email, (err, resultado) => {
            if (err) {
                return reject(err);
            }

            return resolve(resultado.length > 0);
        });
    });
}

module.exports = {validar, verificarExistencia }