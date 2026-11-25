const express = require('express')
const relatoriosControllers = require('../controllers/relatorios')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/categorias', authMiddleware.validarToken, relatoriosControllers.categorias);

router.get('/fontesDestinos', authMiddleware.validarToken, relatoriosControllers.fontesDestinos);

router.get('/faturas', authMiddleware.validarToken, relatoriosControllers.faturas);

module.exports = router