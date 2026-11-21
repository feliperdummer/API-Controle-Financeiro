const fontesDestinosServices = require('../services/fontesDestinos')

function cadastrar(req, res) {
	const resposta = fontesDestinosServices.cadastrar(req.body)
	return res.status(resposta.status).json(resposta)
}

function listar(req, res) {
	const resposta = fontesDestinosServices.listar(req.body, req.query)
	return res.status(resposta.status).json(resposta)
}

function atualizar(req, res) {
	const resposta = fontesDestinosServices.atualizar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

function deletar(req, res) {
	const resposta = fontesDestinosServices.atualizar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

module.exports = {cadastrar, listar, atualizar, deletar}