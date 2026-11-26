const Relatorios = require('../models/Relatorios');
const { dataValidaISO, calcularPeriodoAnterior } = require('../utils/datas');

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

  if (inicio > fim) {
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

  dados.sort((e1, e2) => {
    return e1.categoria_id - e2.categoria_id
  })

  const dadosEntrada = dados.filter(e => e.tipo=='entrada')
  dadosEntrada.forEach(e => e.total = Number(e.total))
  const totalEntrada = dadosEntrada.reduce((t,e) => t+e.total, 0);

  for (let i = 0; i < dadosEntrada.length; i++) {
    dadosEntrada[i].pctSobreTotalEntradas = 
      Math.ceil(dadosEntrada[i].total*100 / totalEntrada) | 0;
  }

  const dadosSaida = dados.filter(e => e.tipo=='saida')
  dadosSaida.forEach(e => e.total = Number(e.total))
  const totalSaida = dadosSaida.reduce((t,e) => t+e.total, 0);

  for (let i = 0; i < dadosSaida.length; i++) {
    dadosSaida[i].pctSobreTotalSaidas = 
      Math.ceil(dadosSaida[i].total*100 / totalSaida) | 0;
  }

  const dadosClean = {
    entrada: dadosEntrada,
    saida: dadosSaida
  }

  const dataAnterior = calcularPeriodoAnterior(dataInicio, dataFim)
  const dadosAnterior = await Relatorio.porCategoria(
    usuarioId, dataAnterior.inicio, dataAnterior.fim)

  if (dadosAnterior) {
    dadosAnterior.sort((e1,e2) => {
      return e1.categoria_id- e2.categoria_id
    })

    const dadosAnteriorEntrada = dadosAnterior.filter(e => e.tipo==='entrada')
    dadosAnteriorEntrada.forEach(e => e.total = Number(e.total))

    for (let i = 0; i < dadosEntrada.length; i++) {
      dadosEntrada[i].valorPeriodoAnterior = dadosAnteriorEntrada[i].total
      dadosEntrada[i].variacaoPercentual = 
        (dadosEntrada[i].total - dadosAnteriorEntrada[i].total) 
          / dadosAnteriorEntrada[i].total * 100 | 0
    }

    const dadosAnteriorSaida = dadosAnterior.filter(e => e.tipo==='saida')
    dadosAnteriorSaida.forEach(e => e.total = Number(e.total))

    for (let i = 0; i < dadosSaida.length; i++) {
      dadosSaida[i].valorPeriodoAnterior = dadosAnteriorSaida[i].total
      dadosSaida[i].variacaoPercentual = 
        (dadosSaida[i].total - dadosAnteriorSaida[i].total)
          / dadosAnteriorSaida[i].total * 100 | 0
    }
  }

  return { status: 200, dados: dadosClean };
}

async function fontesDestinos(filtros, ids) {
  const { usuarioId } = ids;
  const { erros, dataInicio, dataFim } = resolverPeriodo(filtros);

  if (Object.keys(erros).length > 0) {
    return { status: 400, erro: 'Parâmetros inválidos.', campos: erros };
  }

  const dados = await Relatorio.porFonteDestino(usuarioId, dataInicio, dataFim);
  dados.forEach(dado => {
    dado.entradas = Number(dado.entradas)
    dado.saidas = Number(dado.saidas)
  })
  return { status: 200, dados };
}

module.exports = { categorias, fontesDestinos };