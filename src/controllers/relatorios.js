const relatoriosServices = require('../services/relatorios')

function categorias(req, res) {
	const resposta = relatoriosServices.categorias(req.body, req.query)
	return res.status(resposta.status).json(resposta)
}

function fontesDestinos(req, res) {
	const resposta = relatoriosServices.fontesDestinos(req.body, req.query)
	return res.status(resposta.status).json(resposta)
}

function faturas(req, res) {
	const resposta = relatoriosServices.faturas(req.body, req.query)
	return res.status(resposta.status).json(resposta)
}

module.exports = {categorias, fontesDestinos, faturas}