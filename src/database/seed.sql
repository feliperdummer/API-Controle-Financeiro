USE api_financas;

-- 1. Pelo menos 2 usuários (senhas em hash bcrypt: Senha123)
INSERT INTO usuarios (id, nome, email, cpf, senha_hash) VALUES
(1, 'Ana Silva', 'ana@email.com', '52998224725', '<HASH_BCRYPT_AQUI>'),
(2, 'Carlos Souza', 'carlos@email.com', '15350946056', '<HASH_BCRYPT_AQUI>');

-- 2. Categorias dos dois usuários (respeitando uq_categorias_nome)
INSERT INTO categorias (id, usuario_id, nome, tipo) VALUES
-- Usuário 1 (Ana)
(1, 1, 'Salário', 'entrada'),
(2, 1, 'Outras entradas', 'entrada'),
(3, 1, 'Alimentação', 'saida'),
(4, 1, 'Moradia', 'saida'),
(5, 1, 'Saúde', 'saida'),
(6, 1, 'Mobilidade', 'saida'),
(7, 1, 'Lazer', 'saida'),
(8, 1, 'Educação', 'saida'),
-- Usuário 2 (Carlos)
(9, 2, 'Salário', 'entrada'),
(10, 2, 'Alimentação', 'saida'),
(11, 2, 'Mobilidade', 'saida');

-- 3. Fontes e Destinos (incluindo cartao_credito com dia_fechamento, dia_vencimento e limite)
INSERT INTO fontes_destinos (id, usuario_id, nome, tipo, dia_fechamento, dia_vencimento, limite) VALUES
-- Usuário 1 (Ana)
(1, 1, 'Conta corrente', 'conta', NULL, NULL, NULL),
(2, 1, 'Salário Empresa', 'renda', NULL, NULL, NULL),
(3, 1, 'Cartão Nubank', 'cartao_credito', 15, 22, 5000.00),
-- Usuário 2 (Carlos)
(4, 2, 'Conta corrente', 'conta', NULL, NULL, NULL),
(5, 2, 'Cartão Visa', 'cartao_credito', 25, 5, 3000.00);

-- 4. Lançamentos cobrindo 3 meses (2026-09, 2026-10 e 2026-11) + compra parcelada no cartão
INSERT INTO lancamentos (
    usuario_id, tipo, descricao, valor, data,
    categoria_id, fonte_destino_id,
    parcela_atual, total_parcelas, grupo_parcelamento
) VALUES
-- Mês 1: Setembro/2026 (Usuário 1)
(1, 'entrada', 'Salário Setembro', 5200.00, '2026-09-05', 1, 2, 1, 1, NULL),
(1, 'saida', 'Aluguel Setembro', 1500.00, '2026-09-10', 4, 1, 1, 1, NULL),
(1, 'saida', 'Supermercado', 870.00, '2026-09-18', 3, 1, 1, 1, NULL),
(1, 'saida', 'Combustível', 410.00, '2026-09-22', 6, 3, 1, 1, NULL),

-- Mês 2: Outubro/2026 (Usuário 1)
(1, 'entrada', 'Salário Outubro', 5200.00, '2026-10-05', 1, 2, 1, 1, NULL),
(1, 'saida', 'Aluguel Outubro', 1500.00, '2026-10-10', 4, 1, 1, 1, NULL),
(1, 'saida', 'Supermercado e Feira', 980.50, '2026-10-14', 3, 1, 1, 1, NULL),
(1, 'saida', 'Consulta Odontológica', 350.00, '2026-10-20', 5, 3, 1, 1, NULL),

-- Compra parcelada em 3x no Cartão Nubank em 28/10/2026 (R$ 100,00 -> 33,34 + 33,33 + 33,33)
(1, 'saida', 'Curso Online Node.js', 33.34, '2026-10-28', 8, 3, 1, 3, '550e8400-e29b-41d4-a716-446655440000'),
(1, 'saida', 'Curso Online Node.js', 33.33, '2026-10-28', 8, 3, 2, 3, '550e8400-e29b-41d4-a716-446655440000'),
(1, 'saida', 'Curso Online Node.js', 33.33, '2026-10-28', 8, 3, 3, 3, '550e8400-e29b-41d4-a716-446655440000'),

-- Mês 3: Novembro/2026 (Usuário 1)
(1, 'entrada', 'Salário Novembro', 5200.00, '2026-11-05', 1, 2, 1, 1, NULL),
(1, 'saida', 'Aluguel Novembro', 1500.00, '2026-11-10', 4, 1, 1, 1, NULL),
(1, 'saida', 'Restaurante e Cinema', 260.00, '2026-11-16', 7, 3, 1, 1, NULL),
(1, 'saida', 'Aplicativo de Transporte', 195.00, '2026-11-21', 6, 1, 1, 1, NULL),

-- Lançamentos do Usuário 2 (Carlos) para testes de isolamento (RF3 -> 404 ao acessar via Usuário 1)
(2, 'entrada', 'Salário Carlos', 4000.00, '2026-11-05', 9, 4, 1, 1, NULL),
(2, 'saida', 'Jantar', 140.00, '2026-11-12', 10, 5, 1, 1, NULL),
(2, 'saida', 'Abastecimento', 210.00, '2026-11-19', 11, 4, 1, 1, NULL);