const lancamentosServices = require('../services/lancamentos')

async function cadastrar(req, res) {
	const resposta = await lancamentosServices.cadastrar(
		req.body, {usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function listar(req, res) {
	const resposta = await lancamentosServices.listar(
		req.query, {usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function listarPorId(req, res) {
	const resposta = await lancamentosServices.listarPorId(
		{id:req.params.id, usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function atualizar(req, res) {
	const resposta = await lancamentosServices.atualizar(
		req.body, {id:req.params.id, usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function deletar(req, res) {
	const resposta = await lancamentosServices.deletar(
		req.query, {id:req.params.id, usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}	

module.exports = {cadastrar, listar, listarPorId, atualizar, deletar}