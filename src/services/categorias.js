const Categorias = require('../models/Categorias');

const Categoria = new Categorias();

async function listar(query, ids) {
  const { tipo } = query || {};
  const { usuarioId } = ids;

  if (tipo && tipo !== 'entrada' && tipo !== 'saida') {
    return {
      status: 400,
      erro: 'Parâmetro inválido.',
      campos: { tipo: "O tipo deve ser 'entrada' ou 'saida'." }
    };
  }

  const dados = await Categoria.listar(usuarioId, tipo);
  return { 
    status: 200, 
    dados 
  };
}

async function cadastrar(body, ids) {
  const { nome, tipo } = body || {};
  const { usuarioId } = ids;
  
  const erros = {};

  if (!nome || !String(nome).trim() || String(nome).trim().length > 60) {
    erros.nome = 'Informe o nome da categoria (até 60 caracteres).';
  }
  if (tipo !== 'entrada' && tipo !== 'saida') {
    erros.tipo = "O tipo deve ser 'entrada' ou 'saida'.";
  }

  if (Object.keys(erros).length > 0) {
    return { 
      status: 400, 
      erro: 'Dados inválidos.', 
      campos: erros 
    };
  }

  try {
    const criada = await Categoria.cadastrar(usuarioId, {
      nome: String(nome).trim(),
      tipo
    });
    return { status: 201, dados: criada };
  } catch (erro) {
    if (erro && erro.code === 'ER_DUP_ENTRY') {
      return {
        status: 409,
        erro: 'Categoria já cadastrada.',
        campos: { nome: 'Já existe uma categoria com este nome e tipo.' }
      };
    }
    throw erro;
  }
}

async function atualizar(body, ids) {
  const { nome, tipo } = body || {};
  const { id, usuarioId } = ids;
  const erros = {};

  if (!nome || !String(nome).trim() || String(nome).trim().length > 60) {
    erros.nome = 'Informe o nome da categoria (até 60 caracteres).';
  }
  if (tipo !== 'entrada' && tipo !== 'saida') {
    erros.tipo = "O tipo deve ser 'entrada' ou 'saida'.";
  }

  if (Object.keys(erros).length > 0) {
    return { 
      status: 400, 
      erro: 'Dados inválidos.', 
      campos: erros 
    };
  }

  const existente = await Categoria.buscarPorId(id, usuarioId);
  if (!existente) {
    return { 
      status: 404, 
      erro: 'Categoria não encontrada.' 
    };
  }

  if (existente.tipo !== tipo) {
    const vinculados = await Categoria.possuiLancamentos(id, usuarioId);
    if (vinculados > 0) {
      return {
        status: 409,
        erro: 'Não é possível alterar o tipo de uma categoria com lançamentos vinculados.'
      };
    }
  }

  try {
    const atualizada = await Categoria.atualizar(id, usuarioId, {
      nome: String(nome).trim(),
      tipo
    });
    return { status: 200, dados: atualizada };
  } catch (erro) {
    if (erro && erro.code === 'ER_DUP_ENTRY') {
      return {
        status: 409,
        erro: 'Categoria já cadastrada.',
        campos: { nome: 'Já existe uma categoria com este nome e tipo.' }
      };
    }
    throw erro;
  }
}

async function deletar(ids) {
  const { id, usuarioId } = ids;

  const existente = await Categoria.buscarPorId(id, usuarioId);
  if (!existente) {
    return { 
      status: 404, 
      erro: 'Categoria não encontrada.' 
    };
  }

 const temLancamentos = await Categoria.possuiLancamentos(id, usuarioId);
  if (temLancamentos) {
    return {
      status: 409,
      erro: 'Não é possível excluir uma categoria que possui lançamentos vinculados.'
    };
  }

  await Categoria.deletar(id, usuarioId);
  return { 
    status: 204 
  };
}

module.exports = { listar, cadastrar, atualizar, deletar };