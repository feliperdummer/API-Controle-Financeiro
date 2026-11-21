const categoriasServices = require('../services/categorias')

function cadastrar(req, res) {
	const resposta = categoriasServices.cadastrar(req.body)
	return res.status(resposta.status).json(resposta)
}

function listar(req, res) {
	const resposta = categoriasServices.listar(req.body, req.query)
	return res.status(resposta.status).json(resposta)
} 

function atualizar(req, res) {
	const resposta = categoriasServices.atualizar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

function deletar(req, res) {
	const resposta = categoriasServices.deletar(req.body, req.params)
	return res.status(resposta.status).json(resposta)
}

module.exports = {cadastrar, listar, atualizar, deletar}