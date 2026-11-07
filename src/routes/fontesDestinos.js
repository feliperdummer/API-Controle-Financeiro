const express = require('express')
const fontesDestinosController = require('../controller/lancamentos')

const router = express.router()

router.get('/', fontesDestinosController.listar);

router.post('/', fontesDestinosController.cadastrar);

router.put('/:id', fontesDestinosController.update);

router.delete('/:id', fontesDestinosController.delete);
