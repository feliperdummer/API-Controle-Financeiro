const express = require('express')
const fontesDestinosController = require('../controllers/fontesDestinos')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.validarToken, fontesDestinosController.listar);

router.post('/', authMiddleware.validarToken, fontesDestinosController.cadastrar);

router.put('/:id', authMiddleware.validarToken, fontesDestinosController.atualizar);

router.delete('/:id', authMiddleware.validarToken, fontesDestinosController.deletar);

module.exports = router