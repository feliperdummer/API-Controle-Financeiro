const express = require('express')
const categoriasController = require('../controllers/categorias')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', authMiddleware.validarToken, categoriasController.listar);

router.get('/:tipo', authMiddleware.validarToken, categoriasController.listar);

router.post('/', authMiddleware.validarToken, categoriasController.cadastrar);

router.put('/:id', authMiddleware.validarToken, categoriasController.atualizar);

router.delete('/:id', authMiddleware.validarToken, categoriasController.deletar);

module.exports = router
