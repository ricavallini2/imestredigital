# Financial Service - Quick Start

Guia rápido para começar a usar o Financial Service.

## 5 Minutos para Rodar

### 1. Instalar Dependências
```bash
cd services/financial-service
npm install
```

### 2. Configurar Variáveis
```bash
cp .env.example .env
# Edite .env conforme necessário
```

### 3. Iniciar Infraestrutura
```bash
docker-compose up -d
# Espere ~30 segundos para iniciar tudo
```

### 4. Criar Banco de Dados
```bash
npm run db:migrate
```

### 5. Rodar Serviço
```bash
npm run dev
```

Acesso em: `http://localhost:3006`
Docs: `http://localhost:3006/api/docs`

## Health Check
```bash
curl http://localhost:3006/health
```

## Primeiros Passos na API

### 1. Criar uma Conta Financeira
```bash
curl -X POST http://localhost:3006/api/v1/contas \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: tenant-uuid" \
  -d '{
    "nome": "Conta Principal",
    "tipo": "CORRENTE",
    "banco": "Banco do Brasil",
    "agencia": "0001",
    "conta": "123456-7",
    "saldoInicial": 10000
  }'
```

### 2. Criar Categoria
```bash
curl -X POST http://localhost:3006/api/v1/categorias \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: tenant-uuid" \
  -d '{
    "nome": "Vendas",
    "tipo": "RECEITA",
    "icone": "shopping-cart",
    "cor": "#10B981"
  }'
```

### 3. Criar Lançamento
```bash
curl -X POST http://localhost:3006/api/v1/lancamentos \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: tenant-uuid" \
  -d '{
    "tipo": "RECEITA",
    "contaId": "uuid-da-conta",
    "categoria": "Vendas",
    "descricao": "Venda de produtos",
    "valor": 1500.50,
    "dataVencimento": "2026-03-30",
    "cliente": "João Silva"
  }'
```

### 4. Pagar Lançamento
```bash
curl -X POST http://localhost:3006/api/v1/lancamentos/uuid-lancamento/pagar \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: tenant-uuid" \
  -d '{
    "dataPagamento": "2026-03-25",
    "contaId": "uuid-da-conta",
    "formaPagamento": "PIX"
  }'
```

### 5. Gerar Fluxo de Caixa
```bash
curl -X POST http://localhost:3006/api/v1/fluxo-caixa/gerar \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: tenant-uuid" \
  -d '{
    "dataInicio": "2026-03-01",
    "dataFim": "2026-03-31"
  }'
```

## Documentação Swagger

Acesse `http://localhost:3006/api/docs` para explorar todos os endpoints interativamente.

## Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Modo watch

# Build
npm run build            # Compilar TypeScript
npm run start            # Rodar versão compilada
npm run start:prod       # Produção

# Banco de Dados
npm run db:migrate       # Criar/atualizar schema
npm run db:seed          # Semear dados (quando implementado)
npm run db:studio        # Abrir Prisma Studio

# Testes
npm run test             # Rodar testes
npm run test:unit        # Apenas unitários
npm run test:integration # Apenas integração
npm run test:cov         # Com coverage

# Linting
npm run lint             # Verificar
npm run lint:fix         # Corrigir automaticamente

# Limpeza
npm run clean            # Remover dist/
```

## Troubleshooting

### Erro: "Connection refused" no Postgres
```bash
# Verificar se docker está rodando
docker-compose ps

# Reiniciar services
docker-compose restart postgres
```

### Erro: "Kafka broker not available"
```bash
# Aguarde alguns segundos e tente novamente
docker-compose logs redpanda

# Se persistir, reinicie
docker-compose restart redpanda
```

### Erro: "JWT token invalid"
- Configure corretamente `JWT_SECRET` em `.env`
- Use um token válido do auth-service
- Verifique se `X-Tenant-Id` está correto

### Erro: "CORS origin not allowed"
- Verifique `CORS_ORIGINS` em `.env`
- Adicione seu domínio se necessário

## Arquitetura Rápida

```
Financial Service (NestJS)
├── PostgreSQL (Banco de Dados)
├── Redis (Cache)
└── Kafka (Eventos)

Módulos:
├── Conta: Gerencia contas bancárias
├── Lancamento: Contas a pagar/receber
├── Categoria: Categorias hierárquicas
├── Recorrencia: Automação de lançamentos
├── FluxoCaixa: Relatórios de caixa
├── DRE: Demonstração de Resultado
└── Conciliacao: Reconciliação bancária
```

## Integração com Outros Serviços

### Receber Eventos (Consumidor)
- `pedido.pago`: Cria receita automaticamente
- `pedido.cancelado`: Cancela receita
- `nota.autorizada`: Vincula nota fiscal

### Publicar Eventos
- `lancamento.criado`
- `lancamento.pago`
- `lancamento.atrasado`
- `fluxo-caixa.atualizado`
- `dre.gerado`

## Variáveis de Ambiente Essenciais

```env
# Obrigatórias
DATABASE_URL=postgresql://developer:dev123456@localhost:5435/imestredigital_financial
KAFKA_BROKERS=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6380
JWT_SECRET=minha-chave-super-secreta

# Opcionais
PORT=3006
LOG_LEVEL=debug
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Fluxo de Autenticação

1. Obter token do auth-service
2. Incluir em `Authorization: Bearer TOKEN`
3. Incluir `X-Tenant-Id` em header
4. Fazer requisição

```bash
# Exemplo
curl -X GET http://localhost:3006/api/v1/contas \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "X-Tenant-Id: 550e8400-e29b-41d4-a716-446655440000"
```

## Estrutura de Resposta

### Sucesso
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Conta Principal",
  "tipo": "CORRENTE",
  "saldoAtual": 10000,
  "criadoEm": "2026-03-23T10:00:00Z"
}
```

### Erro
```json
{
  "statusCode": 400,
  "message": "Valor deve ser maior que zero",
  "error": "Bad Request"
}
```

## Performance

- Cache TTL padrão: 1 hora
- Paginação máxima: 100 itens
- Índices no BD para queries rápidas
- Lazy loading com cache.obterOuCalcular()

## Monitoramento

### Health Check
```bash
curl http://localhost:3006/health
curl http://localhost:3006/health/live
curl http://localhost:3006/health/ready
```

### Logs
```bash
# Ver logs do serviço
npm run dev

# Ver logs do docker
docker-compose logs financial-service -f
```

## Próximos Passos

1. Ler `README.md` para documentação completa
2. Explorar endpoints no Swagger
3. Adicionar testes
4. Integrar com auth-service
5. Configurar CI/CD

## Suporte

- Veja `IMPLEMENTATION_SUMMARY.md` para detalhes técnicos
- Veja `FILES_MANIFEST.md` para estrutura de arquivos
- Swagger em `http://localhost:3006/api/docs`

Bom desenvolvimento! 🚀
