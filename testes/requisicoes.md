# Testes do sistema: Requisições

## Auth

### POST auth/cadastrar
curl -X POST http://localhost:8081/auth/cadastrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Carlos Eduardo Gonçalves","email":"carlossss@gmail.com","senha":"testeeee","cpf":"555.592.720-78"}'

### POST auth/login 
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"Carlossss@gmail.com","senha":"testeeee"}'

### GET auth/me
curl -X GET http://localhost:8081/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

## Categorias

### GET /categorias?tipo=saida
curl -X GET "http://localhost:8081/categorias?tipo=entrada" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

### POST /categorias
curl -X POST http://localhost:8081/categorias \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Educação","tipo":"saida"}'

### PUT /categorias
curl -X PUT http://localhost:8081/categorias/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Educaçãoo","tipo":"saida"}'

### DELETE /categorias
curl -X DELETE http://localhost:8081/categorias/5 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

## Fontes/Destinos

### GET /fontes-destinos
curl -X GET http://localhost:8081/fontesdestinos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

### POST /fontes-destinos
curl -X POST http://localhost:8081/fontesdestinos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"Nubank","tipo":"cartao_credito","dia_fechamento":24,"dia_vencimento":8,"limite":5000}'

### PUT /fontes-destinos
curl -X PUT http://localhost:8081/fontesdestinos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"nome":"teste","tipo":"cartao_credito","dia_fechamento":24,"dia_vencimento":8,"limite":5000}'

### DELETE /fontes-destinos
curl -X DELETE http://localhost:8081/fontesdestinos/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

## Lançamentos

### GET /lancamentos
curl -X GET http://localhost:8081/lancamentos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

### GET /lancamentos/:id
curl -X GET http://localhost:8081/lancamentos/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

### POST /lancamentos
curl -X POST http://localhost:8081/lancamentos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"tipo":"saida","descricao":"Notebook","valor":3600.00,"data":"2026-11-25","categoriaId":2,"fonteDestinoId":1,"parcelas":6}'

### PUT /lancamentos/:id
curl -X PUT http://localhost:8081/lancamentos/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"descricao":"gasto com supermercado","tipo":"saida","valor":250,"data":"2026-11-25","categoriaId":1,"fonteDestinoId":1}'

### DELETE /lancamentos/:id
curl -X DELETE http://localhost:8081/lancamentos/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

### DELETE /lancamentos/:id?todasParcelas=true
curl -X DELETE "http://localhost:8081/lancamentos/2?todasParcelas=true" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

## Relatórios

### GET /relatorios/categorias?inicio=&fim=
curl -X GET "http://localhost:8081/relatorios/categorias?inicio=2026-09-01&fim=2026-11-30" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

### GET /relatorios/fontes-destinos?inicio=&fim=
curl -X GET "http://localhost:8081/relatorios/fontes-destinos?inicio=2026-11-30&fim=2026-09-01" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"