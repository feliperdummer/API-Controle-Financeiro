const express = require('express')
const relatoriosControllers = require('../controllers/relatorios')

const router = express.Router()

router.get('/categorias', relatoriosControllers.categorias);

router.get('/fontesDestinos', relatoriosControllers.fontesDestinos);

router.get('/faturas', relatoriosControllers.faturas);

module.exports = router