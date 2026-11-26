const express = require('express')
const categoriasController = require('../controllers/categorias')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.protegerRota, categoriasController.listar);

router.get('/:tipo', authMiddleware.protegerRota, categoriasController.listar);

router.post('/', authMiddleware.protegerRota, categoriasController.cadastrar);

router.put('/:id', authMiddleware.protegerRota, categoriasController.atualizar);

router.delete('/:id', authMiddleware.protegerRota, categoriasController.deletar);

module.exports = router
