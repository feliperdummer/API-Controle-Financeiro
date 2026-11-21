const jwtUtils = require('../utils/jwt')

function validarToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            mensagem: "Token não informado."
        });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            mensagem: "Formato do token inválido."
        });
    }

    const usuarioId = jwtUtils.validarToken(token);

    if (!usuarioId) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }

    req.auth = { id: usuarioId };

    next();
}

module.exports={validarToken}