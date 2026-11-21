const express = require('express')
const lancamentosController = require('../controller/lancamentos')

const router = express.router()

router.get('/', lancamentosController.listar);

router.get('/:id', lancamentosController.listarPorId);

router.post('/', lancamentosController.cadastrar);

router.put('/:id', lancamentosController.atualizar);

router.delete('/:id', lancamentosControlller.deletar);

module.exports = router