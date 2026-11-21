const express = require('express')
const categoriasController = require('../controllers/categorias')
const router = express.Router()

router.get('/', categoriasController.listar);

router.post('/', categoriasController.cadastrar);

router.put('/:id', categoriasController.atualizar);

router.delete('/:id', categoriasController.deletar);

module.exports = router
