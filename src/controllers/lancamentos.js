const lancamentosServices = require('../services/lancamentos')

function cadastrar(req, res) {
	const resposta = lancamentosServices.cadastrar(req.body)
	return res.status(resposta.status).json(resposta)
}

function listar(req, res) {
	const resposta = lancamentosServices.listar(req.body, req.query)
	return res.status(resposta.status).json(resposta)
}

function listarPorId(req, res) {
	const resposta = lancamentosServices.listarPorId(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

function atualizar(req, res) {
	const resposta = lancamentosServices.atualizar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

function deletar(req, res) {
	const resposta = lancamentosServices.deletar(
		req.body, req.query, req.params)
	return res.status(resposta.status).json(resposta)
}	

module.exports = {cadastrar, listar, listarPorId, atualizar, deletar}