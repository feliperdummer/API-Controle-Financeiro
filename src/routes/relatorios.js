const express = require('express')
const relatoriosControllers = require('../controllers/relatorios')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/categorias', authMiddleware.validarToken, relatoriosControllers.categorias);

router.get('/fontesDestinos', authMiddleware.validarToken, relatoriosControllers.fontesDestinos);

module.exports = router