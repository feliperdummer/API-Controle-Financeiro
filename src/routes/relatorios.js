const express = require('express')
const relatoriosControllers = require('../controllers/relatorios')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/categorias', authMiddleware.protegerRota, relatoriosControllers.categorias);
router.get('/fontes-destinos', authMiddleware.protegerRota, relatoriosControllers.fontesDestinos);
router.get('/fontesDestinos', authMiddleware.protegerRota, relatoriosControllers.fontesDestinos);
router.get('/faturas', authMiddleware.protegerRota, relatoriosControllers.faturas);

module.exports = router