const categoriasServices = require('../services/categorias')

async function cadastrar(req, res) {
	const resposta = await categoriasServices.cadastrar(
		req.body, {usuarioId: req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function listar(req, res) {
	const resposta = await categoriasServices.listar(
		req.query.tipo, { usuarioId: req.auth.id }
	);
	return res.status(resposta.status).json(resposta);
}

async function atualizar(req, res) {
	const resposta = await categoriasServices.atualizar(
		req.body, {id:req.params.id, usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function deletar(req, res) {
	const resposta = await categoriasServices.deletar(
		{id:req.params.id, usuarioId:req.auth.id})
	return res.status(resposta.status).json(resposta)
}

module.exports = {cadastrar, listar, atualizar, deletar}