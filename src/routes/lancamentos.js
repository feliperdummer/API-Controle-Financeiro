const express = require('express')
const lancamentosController = require('../controllers/lancamentos')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.validarToken, lancamentosController.listar);

router.get('/:id', authMiddleware.validarToken, lancamentosController.listarPorId);

router.post('/', authMiddleware.validarToken, lancamentosController.cadastrar);

router.put('/:id', authMiddleware.validarToken, lancamentosController.atualizar);

router.delete('/:id', authMiddleware.validarToken, lancamentosController.deletar);

module.exports = router