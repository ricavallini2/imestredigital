# Quick Start - Marketplace Service

## ⚡ Setup em 5 Minutos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Gerar Prisma Client
```bash
npx prisma generate
```

### 3. Copiar Variáveis de Ambiente
```bash
cp .env.example .env
```

### 4. Configurar Banco de Dados (desenvolvimento)

**Opção A: PostgreSQL Local**
```bash
# Instalar Docker (se não tiver)
# Executar PostgreSQL
docker run -d \
  --name postgres-marketplace \
  -e POSTGRES_USER=dev \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=marketplace_db \
  -p 5432:5432 \
  postgres:15

# No arquivo .env:
DATABASE_URL=postgresql://dev:dev@localhost:5432/marketplace_db
```

**Opção B: Use variável em memória (para testes)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/marketplace_dev
```

### 5. Executar Migrations
```bash
npx prisma migrate dev --name init
```

### 6. Iniciar a Aplicação
```bash
npm run dev
```

Pronto! Acesse: **http://localhost:3007**

## 📚 Endpoints Principais

### Health Check
```bash
curl http://localhost:3007/health
```

### API Swagger
```
http://localhost:3007/api/docs
```

### Listar Contas (requer x-tenant-id)
```bash
curl -H "x-tenant-id: tenant-123" \
  http://localhost:3007/api/v1/contas
```

### Conectar Novo Marketplace
```bash
curl -X POST http://localhost:3007/api/v1/contas \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: tenant-123" \
  -d '{
    "marketplace": "MERCADO_LIVRE",
    "code": "TG-123456",
    "sellerId": "123456"
  }'
```

## 🔧 Configuração Rápida (Desenvolvimento)

### Redis (Opcional para desenvolvimento)
```bash
docker run -d --name redis -p 6379:6379 redis:7
```

### Kafka/Redpanda (Opcional para desenvolvimento)
```bash
# Usar versão standalone de Redpanda
docker run -d \
  --name redpanda \
  -p 9092:9092 \
  -e REDPANDA_BROKERS=0.0.0.0:29092 \
  vectorized/redpanda:latest
```

### .env Mínimo
```env
NODE_ENV=development
PORT=3007
DATABASE_URL=postgresql://dev:dev@localhost:5432/marketplace_db
REDIS_HOST=localhost
REDIS_PORT=6379
KAFKA_BROKERS=localhost:9092
```

## 🎯 Desenvolvimento

### Rodar em Watch Mode
```bash
npm run dev
```

### Executar Testes
```bash
npm run test
```

### Build para Produção
```bash
npm run build
npm start
```

### Linting e Formatação
```bash
npm run lint
npm run format
```

## 📊 Database

### Visualizar Schema
```bash
npx prisma studio
```

Abre interface web em: **http://localhost:5555**

### Limpar Base (⚠️ Apenas desenvolvimento)
```bash
npx prisma migrate reset
```

### Criar Nova Migration
```bash
npx prisma migrate dev --name nome_descritivo
```

## 🔍 Debugging

### Ver Logs SQL
```bash
# No .env adicione:
DEBUG=prisma:*
```

### Testar Conexão Banco
```bash
npx prisma db execute --stdin < test.sql
```

## 📝 Estrutura Mínima de Requisições

Todos os endpoints requerem o header de tenant:

```bash
-H "x-tenant-id: seu-tenant-id"
```

Exemplo completo:
```bash
curl -X GET http://localhost:3007/api/v1/contas \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: empresa-123"
```

## 🚨 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
npx prisma generate
```

### Erro: "Connection refused" (Banco)
- Verificar se PostgreSQL está rodando
- Verificar DATABASE_URL em .env
- Testar: `psql $DATABASE_URL`

### Erro: "Port 3007 already in use"
```bash
# Mudar port em .env
PORT=3008
```

### Erro de Prisma
```bash
# Regenerar client
npx prisma generate

# Validar schema
npx prisma validate
```

## 📚 Próximos Passos

1. **Explorar Código**: Começar por `src/main.ts`
2. **Ler README**: Documentação detalhada em `README.md`
3. **Ver Checklist**: Próximas implementações em `CHECKLIST_IMPLEMENTACAO.md`
4. **Testar APIs**: Usar Swagger em `/api/docs`
5. **Integrar BDs**: Conectar com Postgres e Kafka reais

## 💡 Dicas

- Usar `npx prisma studio` para explorar dados
- Verificar logs em `npm run dev` (modo watch)
- Swagger está sempre atualizado com decoradores `@Api*`
- Controllers não implementados: ver `ARQUIVOS_RESTANTES.md`

## ✅ Checklist Inicial

- [ ] Node.js 18+ instalado
- [ ] npm install executado
- [ ] .env configurado
- [ ] PostgreSQL rodando
- [ ] npm run dev iniciado
- [ ] http://localhost:3007/health respondendo
- [ ] Swagger em /api/docs carregando

---

**Pronto para começar!** 🚀

Qualquer dúvida, veja `README.md` ou `CHECKLIST_IMPLEMENTACAO.md`
