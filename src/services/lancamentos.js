const Lancamentos = require('../models/Lancamentos');
const Categorias = require('../models/Categorias');
const FontesDestinos = require('../models/FontesDestinos');
const { validarDataISO, intervaloMesAtual } = require('../utils/datas');

const Lancamento = new Lancamentos();
const Categoria = new Categorias();
const FonteDestino = new FontesDestinos();


function validarCompatibilidade(tipo, categoria, fonteDestino, parcelas) {
  const erros = {};

  if (!categoria) {
    erros.categoriaId = 'Categoria não encontrada.';
  } else if (categoria.tipo !== tipo) {
    erros.categoriaId = `A categoria '${categoria.nome}' é do tipo '${categoria.tipo}' e não aceita lançamentos de '${tipo}'.`;
  }

  if (!fonteDestino) {
    erros.fonteDestinoId = 'Fonte/destino não encontrado.';
  } else {
    if (tipo === 'entrada' && fonteDestino.tipo === 'cartao_credito') {
      erros.fonteDestinoId = 'Cartão de crédito não aceita lançamentos de entrada.';
    }
    if (tipo === 'saida' && fonteDestino.tipo === 'renda') {
      erros.fonteDestinoId = 'Fonte de renda não aceita lançamentos de saída.';
    }
    if (parcelas > 1 && fonteDestino.tipo !== 'cartao_credito') {
      erros.parcelas = 'Parcelamento é permitido apenas para cartão de crédito.';
    }
  }

  return erros;
}

async function listar(filtros, ids) {
  const { inicio, fim, tipo, categoriaId, fonteDestinoId, pagina } = filtros || {};
  const { usuarioId } = ids;
  
  const erros = {};

  const padrao = intervaloMesAtual();
  const dataInicio = inicio || padrao.inicio;
  const dataFim = fim || padrao.fim;

  if (!validarDataISO(dataInicio)) {
    erros.inicio = 'Data inicial inválida (use AAAA-MM-DD).';
  }
  if (!validarDataISO(dataFim)) {
    erros.fim = 'Data final inválida (use AAAA-MM-DD).';
  }
  if (validarDataISO(dataInicio) && validarDataISO(dataFim) && dataInicio > dataFim) {
    erros.periodo = 'A data inicial não pode ser maior que a data final.';
  }
  if (tipo && tipo !== 'entrada' && tipo !== 'saida') {
    erros.tipo = "O tipo deve ser 'entrada' ou 'saida'.";
  }

  const paginaNum = pagina ? Number(pagina) : 1;
  if (!Number.isInteger(paginaNum) || paginaNum < 1) {
    erros.pagina = 'A página deve ser um número inteiro maior ou igual a 1.';
  }

  if (Object.keys(erros).length > 0) {
    return { status: 400, erro: 'Parâmetros inválidos.', campos: erros };
  }

  const dados = await Lancamento.listar(usuarioId, {
    inicio: dataInicio,
    fim: dataFim,
    tipo,
    categoriaId: categoriaId ? Number(categoriaId) : undefined,
    fonteDestinoId: fonteDestinoId ? Number(fonteDestinoId) : undefined,
    pagina: paginaNum
  });

  return { status: 200, dados };
}

async function listarPorId(ids) {
  const { id, usuarioId } = ids;
  const dados = await Lancamento.buscarPorId(id, usuarioId);

  if (!dados) {
    return { status: 404, erro: 'Lançamento não encontrado.' };
  }

  return { status: 200, dados };
}

async function cadastrar(body, ids) {
  const { tipo, descricao, valor, data, categoriaId, fonteDestinoId, parcelas } = body || {};
  const { usuarioId } = ids;
  const erros = {};

  if (tipo !== 'entrada' && tipo !== 'saida') {
    erros.tipo = "O tipo deve ser 'entrada' ou 'saida'.";
  }
  if (!descricao || !String(descricao).trim() || String(descricao).trim().length > 160) {
    erros.descricao = 'Informe a descrição (até 160 caracteres).';
  }

  const valorNum = Number(valor);
  if (!Number.isFinite(valorNum) || valorNum <= 0) {
    erros.valor = 'Informe um valor numérico maior que zero.';
  }

  if (!validarDataISO(data)) {
    erros.data = 'Informe uma data válida no formato AAAA-MM-DD.';
  }

  const catId = Number(categoriaId);
  if (!Number.isInteger(catId) || catId <= 0) {
    erros.categoriaId = 'Informe uma categoria válida.';
  }

  const fdId = Number(fonteDestinoId);
  if (!Number.isInteger(fdId) || fdId <= 0) {
    erros.fonteDestinoId = 'Informe uma fonte/destino válida.';
  }

  const qtdParcelas = parcelas !== undefined ? Number(parcelas) : 1;
  if (!Number.isInteger(qtdParcelas) || qtdParcelas < 1 || qtdParcelas > 48) {
    erros.parcelas = 'O número de parcelas deve ser um inteiro entre 1 e 48.';
  }
  if (qtdParcelas > 1 && tipo === 'entrada') {
    erros.parcelas = 'Lançamentos de entrada não podem ser parcelados.';
  }

  if (Object.keys(erros).length > 0) {
    return { status: 400, erro: 'Dados inválidos.', campos: erros };
  }

  const [categoria, fonteDestino] = await Promise.all([
    Categoria.buscarPorId(catId, usuarioId),
    FonteDestino.buscarPorId(fdId, usuarioId)
  ]);

  const errosVinculo = validarCompatibilidade(tipo, categoria, fonteDestino, qtdParcelas);
  if (Object.keys(errosVinculo).length > 0) {
    return { status: 400, erro: 'Vínculo inválido.', campos: errosVinculo };
  }

  const criado = await Lancamento.criar({
    usuarioId,
    tipo,
    descricao: String(descricao).trim(),
    valor: Number(valorNum.toFixed(2)),
    data,
    categoriaId: catId,
    fonteDestinoId: fdId,
    parcelas: qtdParcelas
  });

  return { status: 201, dados: criado };
}

 async function atualizar(body, ids) {
  const { tipo, descricao, valor, data, categoriaId, fonteDestinoId } = body || {};
  const { id, usuarioId } = ids;
  const erros = {};

  if (tipo !== 'entrada' && tipo !== 'saida') {
    erros.tipo = "O tipo deve ser 'entrada' ou 'saida'.";
  }
  if (!descricao || !String(descricao).trim() || String(descricao).trim().length > 160) {
    erros.descricao = 'Informe a descrição (até 160 caracteres).';
  }

  const valorNum = Number(valor);
  if (!Number.isFinite(valorNum) || valorNum <= 0) {
    erros.valor = 'Informe um valor numérico maior que zero.';
  }

  if (!validarDataISO(data)) {
    erros.data = 'Informe uma data válida no formato AAAA-MM-DD.';
  }

  const catId = Number(categoriaId);
  if (!Number.isInteger(catId) || catId <= 0) {
    erros.categoriaId = 'Informe uma categoria válida.';
  }

  const fdId = Number(fonteDestinoId);
  if (!Number.isInteger(fdId) || fdId <= 0) {
    erros.fonteDestinoId = 'Informe uma fonte/destino válida.';
  }

  if (Object.keys(erros).length > 0) {
    return { status: 400, erro: 'Dados inválidos.', campos: erros };
  }

  const existente = await Lancamento.buscarPorId(id, usuarioId);
  if (!existente) {
    return { status: 404, erro: 'Lançamento não encontrado.' };
  }

  const [categoria, fonteDestino] = await Promise.all([
    Categoria.buscarPorId(catId, usuarioId),
    FonteDestino.buscarPorId(fdId, usuarioId)
  ]);

  const errosVinculo = validarCompatibilidade(tipo, categoria, fonteDestino, 1);
  if (Object.keys(errosVinculo).length > 0) {
    return { status: 400, erro: 'Vínculo inválido.', campos: errosVinculo };
  }

  const atualizado = await Lancamento.atualizar(id, usuarioId, {
    tipo,
    descricao: String(descricao).trim(),
    valor: Number(valorNum.toFixed(2)),
    data,
    categoriaId: catId,
    fonteDestinoId: fdId
  });

  return { status: 200, dados: atualizado };
}

async function deletar(filtros, ids) {
  const { todasParcelas } = filtros || {};
  const { id, usuarioId } = ids;

  const apagarGrupo = String(todasParcelas).toLowerCase() === 'true';
  const removido = await Lancamento.excluir(id, usuarioId, apagarGrupo);

  if (!removido) {
    return { status: 404, erro: 'Lançamento não encontrado.' };
  }

  return { status: 204 };
}

module.exports = { cadastrar, listar, listarPorId, atualizar, deletar };