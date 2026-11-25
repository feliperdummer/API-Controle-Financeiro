const jwtUtils = require('../utils/jwt')

function validarToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }

    const usuario = jwtUtils.validarToken(token);

    if (!usuario) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado."
        });
    }

    req.auth = { id: usuario.id };

    next();
}

module.exports={validarToken}