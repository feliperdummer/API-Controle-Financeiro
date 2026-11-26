const Relatorios = require('../models/Relatorios');
const { dataValidaISO, calcularPeriodoAnterior } = require('../utils/datas');
const { calcularFatura, dataSegura } = require('../utils/faturas');

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

async function faturas(filtros, ids) {
  const { usuarioId } = ids;
  const mesesParam = filtros?.meses;
  const meses = mesesParam !== undefined && mesesParam !== '' ? Number(mesesParam) : 3;

  if (!Number.isInteger(meses) || meses < 1 || meses > 12) {
    return {
      status: 400,
      erro: 'Parâmetros inválidos.',
      campos: { meses: 'O parâmetro meses deve ser um número inteiro entre 1 e 12.' }
    };
  }

  const hojeISO = new Date().toISOString().slice(0, 10);
  const cartoes = await Relatorio.listarCartoes(usuarioId);
  const lancamentos = await Relatorio.listarLancamentosCartoes(usuarioId);

  const dados = cartoes.map((cartao) => {
    const limiteTotal = Number(cartao.limite);
    const cartaoCfg = {
      diaFechamento: Number(cartao.dia_fechamento),
      diaVencimento: Number(cartao.dia_vencimento)
    };

    const saidasDoCartao = lancamentos.filter(
      (l) => Number(l.fonte_destino_id) === Number(cartao.id)
    );

    const faturaAtual = calcularFatura(hojeISO, cartaoCfg, 1);
    const [anoBase, mesBase] = faturaAtual.referencia.split('-').map(Number);

    const referencias = Array.from({ length: meses }, (_, i) =>
      dataSegura(anoBase, mesBase - 1 + i, 1).toISOString().slice(0, 7)
    );

    const agrupadoPorReferencia = saidasDoCartao.reduce((acc, lanc) => {
      const dataStr = String(lanc.data).slice(0, 10);
      const parcelaAtual = Number(lanc.parcela_atual);
      const totalParcelas = Number(lanc.total_parcelas);
      const valor = Number(lanc.valor);

      const info = calcularFatura(dataStr, cartaoCfg, parcelaAtual);

      if (!acc[info.referencia]) {
        acc[info.referencia] = {
          referencia: info.referencia,
          fechamento: info.fechamento,
          vencimento: info.vencimento,
          valorTotal: 0,
          lancamentos: []
        };
      }

      acc[info.referencia].lancamentos.push({
        id: lanc.id,
        descricao: totalParcelas > 1
          ? `${lanc.descricao} — ${parcelaAtual}/${totalParcelas}`
          : lanc.descricao,
        valor,
        data: dataStr,
        parcela: `${parcelaAtual}/${totalParcelas}`
      });

      acc[info.referencia].valorTotal = Number(
        (acc[info.referencia].valorTotal + valor).toFixed(2)
      );

      return acc;
    }, {});

    const limiteUtilizado = Number(
      saidasDoCartao
        .reduce((soma, lanc) => {
          const dataStr = String(lanc.data).slice(0, 10);
          const info = calcularFatura(dataStr, cartaoCfg, Number(lanc.parcela_atual));
          return info.vencimento >= hojeISO ? soma + Number(lanc.valor) : soma;
        }, 0)
        .toFixed(2)
    );

    const faturasJanela = referencias.map((ref, idx) => {
      if (agrupadoPorReferencia[ref]) {
        return agrupadoPorReferencia[ref];
      }

      const mesFech =
        cartaoCfg.diaVencimento > cartaoCfg.diaFechamento
          ? mesBase - 1 + idx
          : mesBase - 2 + idx;

      return {
        referencia: ref,
        fechamento: dataSegura(anoBase, mesFech, cartaoCfg.diaFechamento).toISOString().slice(0, 10),
        vencimento: dataSegura(anoBase, mesBase - 1 + idx, cartaoCfg.diaVencimento).toISOString().slice(0, 10),
        valorTotal: 0,
        lancamentos: []
      };
    });

    return {
      cartaoId: cartao.id,
      cartao: cartao.nome,
      limiteTotal,
      limiteUtilizado,
      limiteDisponivel: Number((limiteTotal - limiteUtilizado).toFixed(2)),
      faturas: faturasJanela
    };
  });

  return { status: 200, dados };
}

module.exports = { categorias, fontesDestinos, faturas };