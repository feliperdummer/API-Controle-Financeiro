const fontesDestinosServices = require('../services/fontesDestinos')

async function cadastrar(req, res) {
	const resposta = await fontesDestinosServices.cadastrar(req.body)
	return res.status(resposta.status).json(resposta)
}

async function listar(req, res) {
	const resposta = await fontesDestinosServices.listar(req.body, req.query)
	return res.status(resposta.status).json(resposta)
}

async function atualizar(req, res) {
	const resposta = await fontesDestinosServices.atualizar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

async function deletar(req, res) {
	const resposta = await fontesDestinosServices.deletar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

module.exports = {cadastrar, listar, atualizar, deletar}