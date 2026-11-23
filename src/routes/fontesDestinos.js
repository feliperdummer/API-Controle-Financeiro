const express = require('express')
const fontesDestinosController = require('../controllers/fontesDestinos')

const router = express.Router()

router.get('/', fontesDestinosController.listar);

router.post('/', fontesDestinosController.cadastrar);

router.put('/:id', fontesDestinosController.atualizar);

router.delete('/:id', fontesDestinosController.deletar);

module.exports = router