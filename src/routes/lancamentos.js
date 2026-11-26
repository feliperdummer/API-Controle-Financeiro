const express = require('express')
const lancamentosController = require('../controllers/lancamentos')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.protegerRota, lancamentosController.listar);

router.get('/:id', authMiddleware.protegerRota, lancamentosController.listarPorId);

router.post('/', authMiddleware.protegerRota, lancamentosController.cadastrar);

router.put('/:id', authMiddleware.protegerRota, lancamentosController.atualizar);

router.delete('/:id', authMiddleware.protegerRota, lancamentosController.deletar);

module.exports = router