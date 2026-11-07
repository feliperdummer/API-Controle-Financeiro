const Usuarios = require('../models/Usuarios')
const usuarios = new Usuarios()

function validar(cpf) {
    const d = String(cpf).replace(/\D/g, '');            // mantém só os dígitos
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) {     // rejeita 111.111.111-11 etc.
        return false;
    }
    const digito = (tamanho) => {
        let soma = 0;
        for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * (tamanho + 1 - i);
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };
    return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}


async function verificarExistencia(cpf) {
    return new Promise((resolve) => {
        usuarios.verificarCpfExistente(cpf, (err, resultado) => {
            if (err) {
                return resolve(false);
            }

            return resolve(resultado.length > 0);
        });
    });
}


module.exports = {validar, verificarExistencia}