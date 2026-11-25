const fontesDestinosServices = require('../services/fontesDestinos')

async function cadastrar(req, res) {
	const resposta = await fontesDestinosServices.cadastrar(
		req.body, {usuarioId: req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function listar(req, res) {
	const resposta = await fontesDestinosServices.listar(
		req.query, {usuarioId: req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function atualizar(req, res) {
	const resposta = await fontesDestinosServices.atualizar(
		req.body, {id:req.params.id, usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function deletar(req, res) {
	const resposta = await fontesDestinosServices.deletar(
		{id:req.params.id, usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

module.exports = {cadastrar, listar, atualizar, deletar}