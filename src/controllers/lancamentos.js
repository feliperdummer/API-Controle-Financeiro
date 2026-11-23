const lancamentosServices = require('../services/lancamentos')

async function cadastrar(req, res) {
	const resposta = await lancamentosServices.cadastrar(req.body)
	return res.status(resposta.status).json(resposta)
}

async function listar(req, res) {
	const resposta = await lancamentosServices.listar(req.body, req.query)
	return res.status(resposta.status).json(resposta)
}

async function listarPorId(req, res) {
	const resposta = await lancamentosServices.listarPorId(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

async function atualizar(req, res) {
	const resposta = await lancamentosServices.atualizar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

async function deletar(req, res) {
	const resposta = await lancamentosServices.deletar(
		req.body, req.query, req.params)
	return res.status(resposta.status).json(resposta)
}	

module.exports = {cadastrar, listar, listarPorId, atualizar, deletar}