const jwt = require('jsonwebtoken');

function criarToken(usuarioId) {
    return jwt.sign(
        {id: usuarioId},
        process.env.JWT_SECRET,
        { expiresIn: Number(process.env.JWT_EXPIRES_IN) }
    )
}

function validarToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

module.exports={criarToken, validarToken}