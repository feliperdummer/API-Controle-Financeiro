const express = require('express')
const categoriaController = require('../controllers/categoria')
const router = express.Router()

router.get('/', categoriaController.listar);

router.post('/', categoriaController.cadastrar);

router.put('/:id', categoriaController.update);

router.delete('/:id', categoriaController.delete);

module.exports = router
