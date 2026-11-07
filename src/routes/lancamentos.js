const express = require('express')
const lancamentosController = require('../controller/lancamentos')

const router = express.router()

router.get('/', lancamentosController.listar);

router.get('/:id', lancamentosController.listarPorId);

router.post('/', lancamentosController.cadastrar);

router.put('/:id', lancamentosController.update);

router.delete('/:id', lancamentosControlller.delete);
