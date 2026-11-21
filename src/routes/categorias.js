const express = require('express')
const categoriasController = require('../controllers/categorias')
const router = express.Router()

router.get('/', categoriasController.listar);

router.post('/', categoriasController.cadastrar);

router.put('/:id', categoriasController.update);

router.delete('/:id', categoriasController.delete);

module.exports = router
