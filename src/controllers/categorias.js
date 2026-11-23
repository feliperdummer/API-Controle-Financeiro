const categoriasServices = require('../services/categorias')

async function cadastrar(req, res) {
	const resposta = await categoriasServices.cadastrar(req.body)
	return res.status(resposta.status).json(resposta)
}

async function listar(req, res) {
	const resposta = await categoriasServices.listar(req.body, req.query)
	return res.status(resposta.status).json(resposta)
} 

async function atualizar(req, res) {
	const resposta = await categoriasServices.atualizar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

async function deletar(req, res) {
	const resposta = await categoriasServices.deletar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

module.exports = {cadastrar, listar, atualizar, deletar}