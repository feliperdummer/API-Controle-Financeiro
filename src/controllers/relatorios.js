const relatoriosServices = require('../services/relatorios');

async function categorias(req, res) {
  const usuarioId = (req.usuario || req.auth)?.id;
  const resposta = await relatoriosServices.categorias(req.query, { usuarioId });
  return res.status(resposta.status).json(resposta);
}

async function fontesDestinos(req, res) {
  const usuarioId = (req.usuario || req.auth)?.id;
  const resposta = await relatoriosServices.fontesDestinos(req.query, { usuarioId });
  return res.status(resposta.status).json(resposta);
}

async function faturas(req, res) {
  const usuarioId = (req.usuario || req.auth)?.id;
  const resposta = await relatoriosServices.faturas(req.query, { usuarioId });
  return res.status(resposta.status).json(resposta);
}

module.exports = { categorias, fontesDestinos, faturas };