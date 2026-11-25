const relatoriosServices = require('../services/relatorios')

async function categorias(req, res) {
	const resposta = await relatoriosServices.categorias(
		req.query, {usuarioId: req.auth.id})
	return res.status(resposta.status).json(resposta)
}

async function fontesDestinos(req, res) {
	const resposta = await relatoriosServices.fontesDestinos(
		req.query, {usuarioId: req.auth.id})
	return res.status(resposta.status).json(resposta)
}

module.exports = {categorias, fontesDestinos}