const FontesDestinos = require('../models/FontesDestinos');

const TIPOS_VALIDOS = ['renda', 'conta', 'cartao_credito'];

const fontesdestinos = new FontesDestinos()

function validarPayload(body) {
  const { nome, tipo, dia_fechamento, dia_vencimento, limite } = body || {};
  const erros = {};

  if (!nome || !String(nome).trim() || String(nome).trim().length > 60) {
    erros.nome = 'Informe um nome válido (até 60 caracteres).';
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    erros.tipo = "O tipo deve ser 'renda', 'conta' ou 'cartao_credito'.";
  }

  let fechamento = null;
  let vencimento = null;
  let limiteNum = null;

  if (tipo === 'cartao_credito') {
    fechamento = Number(dia_fechamento);
    vencimento = Number(dia_vencimento);
    limiteNum = Number(limite);

    if (!Number.isInteger(fechamento) || fechamento < 1 || fechamento > 31) {
      erros.dia_fechamento = 'Informe o dia de fechamento entre 1 e 31.';
    }
    if (!Number.isInteger(vencimento) || vencimento < 1 || vencimento > 31) {
      erros.dia_vencimento = 'Informe o dia de vencimento entre 1 e 31.';
    }
    if (!Number.isFinite(limiteNum) || limiteNum <= 0) {
      erros.limite = 'Informe um limite maior que zero.';
    }
  }

  return {
    erros,
    dados: {
      nome: nome ? String(nome).trim() : '',
      tipo,
      dia_fechamento: fechamento,
      dia_vencimento: vencimento,
      limite: limiteNum
    }
  };
}

async function listar(query, ids) {
  const { tipo } = query || {};
  const { usuarioId } = ids;

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
    return {
      status: 400,
      erro: 'Parâmetro inválido.',
      campos: { tipo: "O tipo deve ser 'renda', 'conta' ou 'cartao_credito'." }
    };
  }

  const dados = await fontesdestinos.listar(usuarioId, tipo);
  return { status: 200, dados };
}

async function cadastrar(body, ids) {
  const { usuarioId } = ids;
  const { erros, dados } = validarPayload(body);

  if (Object.keys(erros).length > 0) {
    return { 
      status: 400, 
      erro: 'Dados inválidos.', 
      campos: erros 
    };
  }

  try {
    const criada = await fontesdestinos.cadastrar(usuarioId, dados);
    return { status: 201, dados: criada };
  } catch (erro) {
    if (erro && erro.code === 'ER_DUP_ENTRY') {
      return {
        status: 409,
        erro: 'Fonte/destino já cadastrado.',
        campos: { nome: 'Já existe uma fonte/destino com este nome.' }
      };
    }
    throw erro;
  }
}

async function atualizar(body, ids) {
  const { id, usuarioId } = ids;
  const { erros, dados } = validarPayload(body);
  
  if (Object.keys(erros).length > 0) {
    return { status: 400, erro: 'Dados inválidos.', campos: erros };
  }

  try {
    const atualizada = await fontesdestinos.atualizar(id, usuarioId, dados);
    if (!atualizada) {
      return { status: 404, erro: 'Fonte/destino não encontrado.' };
    }
    return { status: 200, dados: atualizada };
  } catch (erro) {
    if (erro && erro.code === 'ER_DUP_ENTRY') {
      return {
        status: 409,
        erro: 'Fonte/destino já cadastrado.',
        campos: { nome: 'Já existe uma fonte/destino com este nome.' }
      };
    }
    throw erro;
  }
}

async function deletar(ids) {
  const { id, usuarioId } = ids;

  const existente = await fontesdestinos.buscarPorId(id, usuarioId);
  if (!existente) {
    return { status: 404, erro: 'Fonte/destino não encontrado.' };
  }

  const vinculados = await fontesdestinos.possuiLancamentos(id, usuarioId);
  if (vinculados > 0) {
    return {
      status: 409,
      erro: 'Não é possível excluir uma fonte/destino que possui lançamentos vinculados.'
    };
  }

  await fontesdestinos.deletar(id, usuarioId);
  return { status: 204 };
}

module.exports = { listar, cadastrar, atualizar, deletar };