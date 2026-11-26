const express = require('express')
const fontesDestinosController = require('../controllers/fontesDestinos')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.protegerRota, fontesDestinosController.listar);

router.post('/', authMiddleware.protegerRota, fontesDestinosController.cadastrar);

router.put('/:id', authMiddleware.protegerRota, fontesDestinosController.atualizar);

router.delete('/:id', authMiddleware.protegerRota, fontesDestinosController.deletar);

module.exports = router