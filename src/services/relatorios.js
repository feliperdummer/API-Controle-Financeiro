const Relatorios = require('../models/Relatorios');
const { dataValidaISO } = require('../utils/datas');

const Relatorio = new Relatorios();

function resolverPeriodo(filtros) {
  const { inicio, fim } = filtros || {};
  const erros = {};

  if (!inicio) {
    erros.inicio = 'Informe a data inicial (AAAA-MM-DD).';
  } else if (!dataValidaISO(inicio)) {
    erros.inicio = 'Data inicial inválida (use AAAA-MM-DD).';
  }

  if (!fim) {
    erros.fim = 'Informe a data final (AAAA-MM-DD).';
  } else if (!dataValidaISO(fim)) {
    erros.fim = 'Data final inválida (use AAAA-MM-DD).';
  }

  if (dataValidaISO(inicio) && dataValidaISO(fim) && inicio > fim) {
    erros.periodo = 'A data inicial não pode ser maior que a data final.';
  }

  return { erros, dataInicio: inicio, dataFim: fim };
}

async function categorias(filtros, ids) {
  const { usuarioId } = ids;
  const { erros, dataInicio, dataFim } = resolverPeriodo(filtros);

  if (Object.keys(erros).length > 0) {
    return { status: 400, erro: 'Parâmetros inválidos.', campos: erros };
  }

  const dados = await Relatorio.porCategoria(usuarioId, dataInicio, dataFim);
  return { status: 200, dados };
}

async function fontesDestinos(filtros, ids) {
  const { usuarioId } = ids;
  const { erros, dataInicio, dataFim } = resolverPeriodo(filtros);

  if (Object.keys(erros).length > 0) {
    return { status: 400, erro: 'Parâmetros inválidos.', campos: erros };
  }

  const dados = await Relatorio.porFonteDestino(usuarioId, dataInicio, dataFim);
  return { status: 200, dados };
}

module.exports = { categorias, fontesDestinos };